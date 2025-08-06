const image02 = require('../assets/images/image 02.jpg');
const image03 = require('../assets/images/image 03.jpg');
const image04 = require('../assets/images/image 04.jpg');
const image05 = require('../assets/images/image 05.jpg');
const image06 = require('../assets/images/image 06.jpg');
const image07 = require('../assets/images/image 07.jpg');

const universities = [
  {
    slug: 'sunmoon',
    date: 'July 25, 2025',
    title: 'UNIVERSITE DE SUN MOON',
    images: [image02, image03, image04, image05, image06, image07],
    region: 'Chungcheongnam-do',
    type: 'Private',
    desc: "Sun Moon University (SMU), established in 1989, is a private higher education institution located in Asan, South Chungcheong Province, South Korea. It offers a variety of programs leading to bachelor's, master's, and doctoral degrees across multiple fields of study. The university is known for its reasonable tuition fees, low living expenses, and abundance of scholarships. SMU provides various academic and non-academic facilities, including a library, housing, and sports facilities, and has a strong international presence, welcoming over 1,651 international students from 78 countries. The university is also recognized for its commitment to developing students' talents through global exchange programs and partnerships with universities in Central Asia. One of Korea's top and best universities known for excellence in education, research, and innovation.",
    video: 'https://youtu.be/jkm98mmNFyw',
    tags: ['Engineering', 'Language Program'],
    location: { latitude: 36.8017, longitude: 127.0716 },
  },
  {
    slug: 'snu',
    date: 'July 25, 2025',
    title: 'UNIVERSITE DE SEOUL NATIONAL ',
    images: [
      { uri: 'https://cdn.stmarytx.edu/wp-content/uploads/2021/10/st-louis-hall.jpg' },
      { uri: 'https://en.snu.ac.kr/webdata/uploads/eng/image/2020/02/index-campas-img01.jpg' },
      { uri: 'https://thongtinduhoc.org/uploads/129/5e28447f70b26.jpg' },
    ],
    desc: "Seoul National University (SNU), fondée en 1946, est l’une des universités les plus prestigieuses de Corée du Sud. Elle offre des programmes variés dans les domaines des sciences, de l’ingénierie, des sciences sociales, des lettres, du droit et de la médecine. SNU se distingue par son excellence académique, ses contributions à la recherche, et ses nombreux partenariats internationaux. Située à Séoul, elle offre un campus moderne et une vie étudiante dynamique, attirant des milliers d’étudiants étrangers chaque année.",
    video: 'https://youtu.be/8Rgn-TskeQI',
    tags: ['Rankings', 'Scholarships'],
    region: 'Seoul',
    type: 'National',
    location: { latitude: 37.4599, longitude: 126.9519 },
  },
  {
    slug: 'kaist',
    date: 'July 20, 2025',
    title: 'UNIVERSITE DE KAIST',
    images: [
      { uri: 'https://img1.daumcdn.net/thumb/S1200x630/?fname=https://t1.daumcdn.net/news/201703/16/mk/20170316094402805rhxo.jpg' },
    ],
    desc: "KAIST (Korea Advanced Institute of Science and Technology), situé à Daejeon, est l’un des principaux instituts de recherche scientifique et technologique en Corée. Fondé en 1971, il est reconnu mondialement pour son innovation, ses laboratoires de pointe et son enseignement axé sur la recherche. Il attire de nombreux chercheurs et étudiants internationaux dans les domaines de l’IA, la robotique, l’informatique et l’ingénierie.",
    video: 'https://youtu.be/UEYCIqrlayc',
    tags: ['Science', 'Student Life'],
    region: 'Daejeon',
    type: 'National',
    location: { latitude: 36.3726, longitude: 127.3628 },
  },
  {
    slug: 'yonsei',
    date: 'July 18, 2025',
    title: 'UNIVERSITE DE YONSEI',
    images: [
      { uri: 'https://img.youtube.com/vi/4CZ5p4RZZ0A/maxresdefault.jpg' },
    ],
    desc: "Fondée en 1885, Yonsei University est l’une des trois universités SKY les plus prestigieuses de Corée. Située au cœur de Séoul, elle allie tradition académique et modernité. Elle est réputée pour son excellence en business, sciences humaines, médecine et relations internationales. L’université accueille de nombreux programmes d’échange avec l’étranger et dispose d’un magnifique campus entouré de nature.",
    video: 'https://youtu.be/4CZ5p4RZZ0A',
    tags: ['Student Life', 'Rankings'],
    region: 'Seoul',
    type: 'Private',
    location: { latitude: 37.5658, longitude: 126.9386 },
  },
  {
    slug: 'korea-univ',
    date: 'July 15, 2025',
    title: 'UNIVERSITE DE KOREA',
    images: [
      { uri: 'https://scholarships.world/wp-content/uploads/2023/02/f35a88005a8c108ea422b8afa81528eb.jpg' },
    ],
    desc: "Korea University, fondée en 1905, est reconnue pour son excellence en droit, en administration des affaires et en ingénierie. Elle dispose d’un vaste campus moderne à Séoul avec des installations sportives et académiques de haut niveau. Elle fait également partie des universités SKY et attire de nombreux étudiants internationaux avec ses programmes en anglais.",
    video: 'https://youtu.be/N6K63uT0CoQ',
    tags: ['Law', 'Business'],
    region: 'Seoul',
    type: 'Private',
    location: { latitude: 37.5894, longitude: 127.0337 },
  },
  {
    slug: 'POHANG',
    date: 'July 12, 2025',
    title: 'UNIVERSITE DE POHANG',
    images: [
      { uri: 'https://newsfeed.ph/wp-content/uploads/2016/08/Pohang-University-of-Science-Technology-POSTECH.jpg' },
    ],
    desc: "POSTECH est une université de recherche de haut niveau située à Pohang, spécialisée en science et en ingénierie. Elle a été classée parmi les meilleures universités asiatiques en termes d’innovation et de publications scientifiques. Elle offre un environnement hautement technologique et des laboratoires collaborant avec l’industrie (comme POSCO).",
    video: 'https://youtu.be/AozFShZK3VY',
    tags: ['Engineering', 'Innovation'],
    region: 'Pohang',
    type: 'Private',
    location: { latitude: 36.0145, longitude: 129.3238 },
  },
  {
    slug: 'hanyang',
    date: 'July 10, 2025',
    title: 'UNIVERSITE DE HANYANG ',
    images: [
      { uri: 'https://wimg.mk.co.kr/news/cms/202405/29/20240529_01110205000002_L00.jpg' },
    ],
    desc: "Hanyang University, fondée en 1939, est particulièrement reconnue pour ses formations en ingénierie, architecture et technologies émergentes. Elle est aussi célèbre pour sa forte culture entrepreneuriale et son incubateur de startups. Avec des campus à Séoul et Ansan, elle favorise une éducation pratique et internationale.",
    video: 'https://youtu.be/0KjdcUpZlRU',
    tags: ['Engineering', 'Startups'],
    region: 'Seoul',
    type: 'Private',
    location: { latitude: 37.5577, longitude: 127.0456 },
  },
  {
    slug: 'ewha',
    date: 'July 8, 2025',
    title: 'UNIVERSITE DE EWHA WOMANS ',
    images: [
      { uri: 'https://smapse.com/storage/2018/10/converted/825_585_iwha-university-in-korea-4.jpg' },
    ],
    desc: "Ewha Womans University, fondée en 1886, est la plus grande université pour femmes au monde. Elle propose un large éventail de disciplines allant des sciences humaines aux technologies avancées. Le campus est un symbole de l’histoire de l’éducation féminine en Corée et attire de nombreuses étudiantes du monde entier grâce à ses programmes multiculturels.",
    video: 'https://youtu.be/MoO--VxXq9I',
    tags: ['Women', 'Humanities'],
    region: 'Seoul',
    type: 'Private',
    location: { latitude: 37.5642, longitude: 126.9613 },
  },
  {
    slug: 'skku',
    date: 'July 6, 2025',
    title: 'UNIVERSITE DE SUNGKYUNKWAN',
    images: [
      { uri: 'https://i0.wp.com/konsultanpendidikan.com/wp-content/uploads/2014/03/samsung_library_at_suwon_campus_of_sungkyunkwan_university.jpg?fit=4288%2C2416&ssl=1' },
    ],
    desc: "Sungkyunkwan University (SKKU) est l’une des plus anciennes institutions éducatives d’Asie, fondée en 1398, et modernisée avec le soutien de Samsung. Elle propose des formations de qualité dans tous les domaines : sciences, ingénierie, droit, économie et médecine. Son campus historique à Séoul est complété par un site moderne à Suwon.",
    tags: ['Tradition', 'Modernization'],
    region: 'Seoul / Suwon',
    type: 'Private',
    location: { latitude: 37.5871, longitude: 126.9931 },
  },
  {
    slug: 'ajou',
    date: 'July 5, 2025',
    title: 'UNIVERSITE DE AJOU',
    images: [
      { uri: 'https://www.ajou.ac.kr/_attach/ajou/image/2024/06/gHKXcbwLzDjYSYPnTZlwWiIgNt.jpg' },
    ],
    desc: "Ajou University est une université privée innovante située à Suwon, spécialisée en TIC, ingénierie et commerce international. Elle développe des échanges universitaires avec plus de 300 institutions dans 60 pays. Son environnement multiculturel et ses technologies de pointe en font un choix populaire pour les étudiants internationaux.",
    video: 'https://youtu.be/AjouIct',
    tags: ['ICT', 'Exchange'],
    region: 'Suwon',
    type: 'Private',
    location: { latitude: 37.2837, longitude: 127.0437 },
  },
];

export default universities;
