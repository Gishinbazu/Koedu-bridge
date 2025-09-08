// hooks/useManagerDB.js
import { collection, getCountFromServer, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../services/firebase';

export function useManagerDashboard(uid) {
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState({});
  const [pipeline, setPipeline] = useState({ new: [], review: [], waiting: [], decision: [] });
  const [threads, setThreads] = useState([]);
  const [events, setEvents] = useState([]);
  const [activity, setActivity] = useState([]);

  useEffect(() => {
    if (!uid) return;
    (async () => {
      setLoading(true);
      try {
        // KPIs
        const appsCol = collection(db, 'applications');
        const unreadCol = collection(db, 'threads');
        const tasksCol = collection(db, 'tasks');
        const meetingsCol = collection(db, 'events');

        const [pendingCt, unreadCt, dueTodayCt, meetingsCt] = await Promise.all([
          getCountFromServer(query(appsCol, where('status', 'in', ['new','review','waiting']))),
          getCountFromServer(query(unreadCol, where('assigneeId', '==', uid), where('unreadFor', 'array-contains', uid))),
          getCountFromServer(query(tasksCol, where('assigneeId', '==', uid), where('dueDate', '<=', new Date().toISOString().slice(0,10)))),
          getCountFromServer(query(meetingsCol, where('attendees', 'array-contains', uid))),
        ]);

        setKpis({
          pending: pendingCt.data().count,
          unread: unreadCt.data().count,
          dueToday: dueTodayCt.data().count,
          meetings: meetingsCt.data().count,
        });

        // Pipeline (latest 5 by column)
        const statuses = ['new','review','waiting','decision'];
        const out = {};
        for (const st of statuses) {
          const snap = await getDocs(query(appsCol, where('status','==',st), orderBy('updatedAt','desc'), limit(5)));
          out[st] = snap.docs.map(d => ({
            id: d.id,
            studentName: d.data().studentName,
            programTitle: d.data().programTitle,
          }));
        }
        setPipeline(out);

        // Threads preview
        const ts = await getDocs(query(unreadCol, where('assigneeId','==',uid), orderBy('updatedAt','desc'), limit(6)));
        setThreads(ts.docs.map(d => ({
          id: d.id,
          studentName: d.data().participantName,
          unread: (d.data().unreadFor || []).includes(uid) ? 1 : 0,
          lastMsg: d.data().lastSnippet || '…',
          timeAgo: timeAgoFrom(d.data().updatedAt?.toDate?.() || new Date()),
        })));

        // Events next 7 days
        const now = new Date();
        const until = new Date(now); until.setDate(until.getDate()+7);
        const evs = await getDocs(query(meetingsCol, where('start','>=', now.toISOString()), where('start','<=', until.toISOString()), orderBy('start','asc')));
        setEvents(evs.docs.map(d => ({ id:d.id, title:d.data().title, when:new Date(d.data().start).toLocaleString() })));

        // Activity (last 8)
        const acts = await getDocs(query(collection(db,'activity'), orderBy('createdAt','desc'), limit(8)));
        setActivity(acts.docs.map(d => ({ id:d.id, text:d.data().text, timeAgo: timeAgoFrom(d.data().createdAt?.toDate?.() || new Date()) })));
      } catch (e) {
        console.error('[useManagerDashboard]', e);
      } finally {
        setLoading(false);
      }
    })();
  }, [uid]);

  return { kpis, pipeline, threads, events, activity, loading };
}

function timeAgoFrom(date) {
  const diff = Math.max(1, Math.floor((Date.now() - date.getTime())/1000));
  if (diff < 60) return `${diff}s`;
  const m = Math.floor(diff/60); if (m < 60) return `${m}m`;
  const h = Math.floor(m/60); if (h < 24) return `${h}h`;
  const d = Math.floor(h/24); return `${d}d`;
}
