import type { BookingSource, FeedbackItem, Location, Segment, Vehicle } from './types';

const locations: Location[] = ['Auckland', 'Wellington', 'Christchurch', 'Queenstown'];
const bookingSources: BookingSource[] = [
  'Online Booking',
  'Telephone Booking',
  'Email inquiry',
  'Agent Booking',
];
const vehicles: Vehicle[] = [
  'Mitsubishi ASX',
  'Suzuki Swift',
  'Toyota Corolla',
  'Kia Cerato',
];

const firstNames = [
  'Olivia',
  'Noah',
  'Sophie',
  'Liam',
  'Emma',
  'Jack',
  'Amelia',
  'Lucas',
  'Mia',
  'Aria',
  'Ethan',
  'Grace',
  'Isla',
  'Leo',
  'Ruby',
  'Hugo',
  'Ella',
  'Max',
  'Charlotte',
  'Finn',
];

const lastNames = [
  'Wilson',
  'Patel',
  'Ngata',
  'Taylor',
  'Johnson',
  'Baker',
  'Fraser',
  'Murphy',
  'Singh',
  'Martin',
  'Clark',
  'Evans',
  'Thompson',
  'Walker',
  'Cooper',
  'Reid',
  'Kelly',
  'Bennett',
  'Young',
  'Scott',
];

const promoterComments = [
  'Quick pickup, spotless car, and the team made the whole trip effortless.',
  'Excellent service from booking to return. I would recommend Atomic Rentals.',
  'The process was fast and the vehicle was exactly what I expected.',
  'Friendly staff, easy handover, and the car handled the South Island well.',
  'Great value and no surprises at pickup. I would book again.',
  'Everything ran on time and the return process was even faster than pickup.',
  'Clear communication, helpful team, and a very clean vehicle.',
  'Smooth online booking and the branch staff were excellent to deal with.',
];

const passiveComments = [
  'Overall good, but the wait at the counter was longer than expected.',
  'The car was fine, though I needed a bit more explanation on the return steps.',
  'Booking was straightforward but pickup felt slightly rushed.',
];

const detractorComments = [
  'The vehicle was late coming back from its previous hire and that affected our plans.',
  'Customer service recovered eventually, but the initial handover was frustrating.',
];

function createRandom(seed: number) {
  let state = seed;

  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

function pickFromList<T>(items: T[], random: () => number) {
  return items[Math.floor(random() * items.length)];
}

function formatDate(date: Date) {
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
}

function getCommentForScore(score: number, random: () => number) {
  if (score >= 9) {
    return pickFromList(promoterComments, random);
  }

  if (score >= 7) {
    return pickFromList(passiveComments, random);
  }

  return pickFromList(detractorComments, random);
}

function getSegment(score: number): Segment {
  if (score >= 9) {
    return 'promoter';
  }

  if (score >= 7) {
    return 'passive';
  }

  return 'detractor';
}

export function classifySegment(score: number | null) {
  if (score === null) {
    return null;
  }

  return getSegment(score);
}

export const filterOptions = {
  locations,
  bookingSources,
  vehicles,
};

export function createSurveySubmission(
  existingEntries: FeedbackItem[],
  score: number,
  comments: string,
): FeedbackItem {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const pickupDate = new Date();
  const offsetDays = Math.floor(Math.random() * 45) + 7;
  pickupDate.setDate(pickupDate.getDate() - offsetDays);

  const dropOffDate = new Date(pickupDate);
  dropOffDate.setDate(pickupDate.getDate() + 2 + Math.floor(Math.random() * 8));

  const nextId =
    existingEntries.length === 0
      ? 1
      : Math.max(...existingEntries.map((entry) => entry.id)) + 1;

  return {
    id: nextId,
    pickupLocation: locations[Math.floor(Math.random() * locations.length)],
    dropOffLocation: locations[Math.floor(Math.random() * locations.length)],
    pickupDate: formatDate(pickupDate),
    dropOffDate: formatDate(dropOffDate),
    bookingSource: bookingSources[Math.floor(Math.random() * bookingSources.length)],
    vehicle: vehicles[Math.floor(Math.random() * vehicles.length)],
    firstName,
    lastName,
    email: `${firstName}.${lastName}${nextId}@myrentalcar.co.nz`.toLowerCase(),
    score,
    comments: comments.trim(),
    feedbackReply: null,
  };
}

export const seededFeedback: FeedbackItem[] = (() => {
  const random = createRandom(20260503);
  const scores = [10, 9, 10, 9, 10, 9, 10, 9, 10, 9, 10, 10, 9, 10, 9, 10, 8, 7, 8, 5];
  const repliedFeedback = scores.map((score, index) => {
    const firstName = firstNames[index % firstNames.length];
    const lastName = lastNames[(index * 3) % lastNames.length];
    const pickupDate = new Date(2026, 0, 5 + Math.floor(random() * 105));
    const hireDays = 2 + Math.floor(random() * 9);
    const dropOffDate = new Date(pickupDate);

    dropOffDate.setDate(pickupDate.getDate() + hireDays);

    return {
      id: index + 1,
      pickupLocation: pickFromList(locations, random),
      dropOffLocation: pickFromList(locations, random),
      pickupDate: formatDate(pickupDate),
      dropOffDate: formatDate(dropOffDate),
      bookingSource: pickFromList(bookingSources, random),
      vehicle: pickFromList(vehicles, random),
      firstName,
      lastName,
      email: `${firstName}.${lastName}${index + 1}@myrentalcar.co.nz`.toLowerCase(),
      score,
      comments: getCommentForScore(score, random),
      feedbackReply: null,
    };
  });

  const pendingFeedback = Array.from({ length: 10 }, (_, offset) => {
    const index = offset + scores.length;
    const firstName = firstNames[index % firstNames.length];
    const lastName = lastNames[(index * 3) % lastNames.length];
    const pickupDate = new Date(2026, 1, 1 + Math.floor(random() * 75));
    const hireDays = 2 + Math.floor(random() * 9);
    const dropOffDate = new Date(pickupDate);

    dropOffDate.setDate(pickupDate.getDate() + hireDays);

    return {
      id: index + 1,
      pickupLocation: pickFromList(locations, random),
      dropOffLocation: pickFromList(locations, random),
      pickupDate: formatDate(pickupDate),
      dropOffDate: formatDate(dropOffDate),
      bookingSource: pickFromList(bookingSources, random),
      vehicle: pickFromList(vehicles, random),
      firstName,
      lastName,
      email: `${firstName}.${lastName}${index + 1}@myrentalcar.co.nz`.toLowerCase(),
      score: null,
      comments: null,
      feedbackReply: null,
    };
  });

  return [...repliedFeedback, ...pendingFeedback]
    .map((entry) => ({ entry, order: random() }))
    .sort((left, right) => left.order - right.order)
    .map(({ entry }) => entry);
})();
