export type Location = 'Auckland' | 'Wellington' | 'Christchurch' | 'Queenstown';

export type BookingSource =
  | 'Online Booking'
  | 'Telephone Booking'
  | 'Email inquiry'
  | 'Agent Booking';

export type Vehicle =
  | 'Mitsubishi ASX'
  | 'Suzuki Swift'
  | 'Toyota Corolla'
  | 'Kia Cerato';

export type Segment = 'all' | 'promoter' | 'passive' | 'detractor';
export type ReplyTemplateKey = 'promoter' | 'passive' | 'detractor';

export type FeedbackReply = {
  templateKey: ReplyTemplateKey;
  staffComments: string;
  renderedHtml: string;
  sentAt: string;
};

export type FeedbackItem = {
  id: number;
  pickupLocation: Location;
  dropOffLocation: Location;
  pickupDate: string;
  dropOffDate: string;
  bookingSource: BookingSource;
  vehicle: Vehicle;
  firstName: string;
  lastName: string;
  email: string;
  score: number | null;
  comments: string | null;
  feedbackReply: FeedbackReply | null;
};
