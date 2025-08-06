// application-form.js – structure de base pour KOEDU BRIDGE

import { useState } from 'react';
import { ScrollView } from 'react-native';
import FileUploader from '../components/FileUploader';
import KoeduFormSection from '../components/KoeduFormSection';

export default function ApplicationForm() {
    const [passportFile, setPassportFile] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    nationality: '',
    passportNumber: '',
    email: '',
    phone: '',
  });

  const personalFields = [
    { key: 'fullName', label: 'Nom complet', placeholder: 'Ex: Gishin Bazu' },
    { key: 'nationality', label: 'Nationalité', placeholder: 'Ex: Cameroun' },
    { key: 'passportNumber', label: 'Numéro de passeport', placeholder: 'Ex: AF123456' },
    { key: 'email', label: 'Adresse e-mail', placeholder: 'Ex: exemple@mail.com', keyboard: 'email-address' },
    { key: 'phone', label: 'Téléphone', placeholder: 'Ex: +82 10 1234 5678', keyboard: 'phone-pad' },
  ];

  return (
    <ScrollView>
      <KoeduFormSection
        title="Informations personnelles"
        fields={personalFields}
        formData={formData}
        setFormData={setFormData}
      />
      <View style={{ padding: 20 }}>
      <FileUploader
        label="Téléverser votre passeport"
        file={passportFile}
        setFile={setPassportFile}
      />
    </View>
    </ScrollView>
  );
}
