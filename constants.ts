
import { Offer, OfferType } from './types';

export const MIN_WITHDRAWAL = 499;
export const COIN_VALUE_INR = 1; // 1 Coin = ₹1
export const DAILY_CHECKIN_REWARD = 1;

export const OFFERS: Offer[] = [
  {
    id: 'off_1',
    title: 'Flash Rewards',
    description: 'Install and open for instant ₹5. Signup for more.',
    reward: 20,
    link: 'https://otieu.com/4/10508140',
    icon: 'https://picsum.photos/100/100?random=1',
    type: OfferType.INSTALL,
    steps: ['Install (₹5)', 'Signup (+₹10)', 'KYC (+₹5)']
  },
  {
    id: 'off_2',
    title: 'Fast Cash',
    description: 'High paying install offer.',
    reward: 20,
    link: 'https://otieu.com/4/10508130',
    icon: 'https://picsum.photos/100/100?random=2',
    type: OfferType.INSTALL,
    steps: ['Install (₹5)', 'Signup (+₹10)', 'KYC (+₹5)']
  },
  {
    id: 'off_3',
    title: 'Easy Earn',
    description: 'Complete simple registration.',
    reward: 20,
    link: 'https://otieu.com/4/10507919',
    icon: 'https://picsum.photos/100/100?random=3',
    type: OfferType.INSTALL,
    steps: ['Install (₹5)', 'Signup (+₹10)', 'KYC (+₹5)']
  },
  {
    id: 'off_4',
    title: 'Mega Rewards',
    description: 'Download and explore.',
    reward: 20,
    link: 'https://otieu.com/4/10508135',
    icon: 'https://picsum.photos/100/100?random=4',
    type: OfferType.INSTALL,
    steps: ['Install (₹5)', 'Signup (+₹10)', 'KYC (+₹5)']
  },
  {
    id: 'off_5',
    title: 'Cash King',
    description: 'The ultimate earning app.',
    reward: 20,
    link: 'https://otieu.com/4/10508127',
    icon: 'https://picsum.photos/100/100?random=5',
    type: OfferType.INSTALL,
    steps: ['Install (₹5)', 'Signup (+₹10)', 'KYC (+₹5)']
  },
  {
    id: 'off_6',
    title: 'Prime Offer',
    description: 'Secure your bonus today.',
    reward: 20,
    link: 'https://trianglerockers.com/1869976',
    icon: 'https://picsum.photos/100/100?random=6',
    type: OfferType.INSTALL,
    steps: ['Install (₹5)', 'Signup (+₹10)', 'KYC (+₹5)']
  },
  {
    id: 'off_7',
    title: 'Gold Rewards',
    description: 'Premium surveys and installs.',
    reward: 20,
    link: 'https://trianglerockers.com/1870187',
    icon: 'https://picsum.photos/100/100?random=7',
    type: OfferType.INSTALL,
    steps: ['Install (₹5)', 'Signup (+₹10)', 'KYC (+₹5)']
  }
];
