// Content shared with the website (index.html / contact.html).
// Edit here to update the app.

export const profile = {
  firstName: 'Prashant',
  lastName: 'Koirala',
  tagline: 'Code / Design / Craft / Repeat',
  bio: "I'm a designer and full-stack developer who's obsessed with creating award-worthy digital experiences. From crafting pixel-perfect interfaces to architecting robust backend systems, I live at the intersection where beautiful design meets clean code. My work draws inspiration from the best of Awwwards — those jaw-dropping sites that make you pause mid-scroll and wonder \"how did they do that?\"",
  email: 'prashantkoirala465@gmail.com',
  resumeUrl:
    'https://drive.google.com/file/d/1lhunYlVGdRqDiOsPf6xECVWj0x6tDbzR/view?usp=sharing',
  portrait: require('../../assets/images/portrait.jpeg'),
  heroImage: require('../../assets/images/img1.jpg'),
  symbols: require('../../assets/images/symbols.png'),
  footerSymbol: require('../../assets/images/s6.png'),
};

export type Project = {
  id: string;
  title: string;
  image: number;
};

export const projects: Project[] = [
  { id: 'triad-portfolio', title: 'Triad Portfolio', image: require('../../assets/images/work/work-item-1.jpg') },
  { id: 'pinnacle-urja', title: 'Pinnacle Urja', image: require('../../assets/images/work/work-item-2.jpg') },
  { id: 'ocean-education', title: 'Ocean Education', image: require('../../assets/images/work/work-item-4.jpg') },
  { id: 'sign2text', title: 'Sign2Text', image: require('../../assets/images/work/work-item-5.jpg') },
];

export const services = [
  { title: 'Frontend Development', image: require('../../assets/images/services/service-1.jpg') },
  { title: 'Backend Development', image: require('../../assets/images/services/service-2.jpg') },
  { title: 'UI/UX Design', image: require('../../assets/images/services/service-3.jpg') },
  { title: 'Web Applications', image: require('../../assets/images/services/service-4.jpg') },
];

export type LinkGroup = { heading: string; links: { label: string; url: string }[] };

export const linkGroups: LinkGroup[] = [
  {
    heading: 'Connect',
    links: [
      { label: 'LinkedIn', url: 'https://www.linkedin.com/in/prashantkoirala/' },
      { label: 'Github', url: 'https://github.com/prashantkoirala465' },
      { label: 'Twitter', url: 'https://x.com/arkynox_' },
    ],
  },
  {
    heading: 'Creative Hub',
    links: [
      { label: 'View Portfolio', url: 'https://www.prashantkoirala.info.np' },
      { label: 'View Blog', url: 'https://prashantkoirala.hashnode.dev/' },
    ],
  },
  {
    heading: 'Extras',
    links: [
      { label: 'Design Archive', url: 'https://www.awwwards.com/winner-list/' },
      { label: 'Basic References', url: 'https://www.pillarstack.com/' },
      { label: 'Animation References', url: 'https://blog.olivierlarose.com/' },
    ],
  },
];

export const projectTypes = [
  'Website Development',
  'Web Application',
  'Mobile Application',
  'E-commerce Platform',
  'Website Redesign',
  'Consultation',
  'Other',
];
