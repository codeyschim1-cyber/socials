import { ThriftEvent } from '@/types/calendar';

export const THRIFT_EVENTS: ThriftEvent[] = [
  // --- NEW YORK ---
  {
    id: 'brooklyn-flea-williamsburg',
    name: 'Brooklyn Flea — Williamsburg',
    description: 'Iconic outdoor market with vintage clothing, furniture, collectibles, and local food vendors.',
    location: 'Williamsburg, Brooklyn',
    state: 'NY',
    url: 'https://brooklynflea.com',
    time: '10am–5pm',
    recurrence: { type: 'weekly', dayOfWeek: 6 }, // Saturday
    seasonStart: 4,
    seasonEnd: 11,
  },
  {
    id: 'brooklyn-flea-dumbo',
    name: 'Brooklyn Flea — DUMBO',
    description: 'Waterfront market featuring vintage goods, antiques, and artisan food under the Manhattan Bridge.',
    location: 'DUMBO, Brooklyn',
    state: 'NY',
    url: 'https://brooklynflea.com',
    time: '10am–5pm',
    recurrence: { type: 'weekly', dayOfWeek: 0 }, // Sunday
    seasonStart: 4,
    seasonEnd: 11,
  },
  {
    id: 'hells-kitchen-flea',
    name: "Hell's Kitchen Flea Market",
    description: 'Long-running weekend flea market with vintage clothing, jewelry, and antiques in Midtown West.',
    location: "Hell's Kitchen, Manhattan",
    state: 'NY',
    url: 'https://www.hellskitchenfleamarket.com',
    time: '9am–5pm',
    recurrence: { type: 'weekly', dayOfWeek: 6 }, // Saturday
  },
  {
    id: 'chelsea-flea',
    name: 'Chelsea Flea Market',
    description: 'Curated market with vintage fashion, art, and collectibles in the heart of Chelsea.',
    location: 'Chelsea, Manhattan',
    state: 'NY',
    url: 'https://www.chelseafleamarket.com',
    time: '9am–5pm',
    recurrence: { type: 'weekly', dayOfWeek: 6 }, // Saturday
  },
  {
    id: 'artists-fleas-williamsburg',
    name: 'Artists & Fleas',
    description: 'Indoor market showcasing independent artists, vintage dealers, and designers.',
    location: 'Williamsburg, Brooklyn',
    state: 'NY',
    url: 'https://www.artistsandfleas.com',
    time: '10am–7pm',
    recurrence: { type: 'weekly', dayOfWeek: 6 }, // Saturday
  },
  {
    id: 'stormville-flea',
    name: 'Stormville Airport Antique Show & Flea Market',
    description: 'Massive outdoor flea market with 600+ vendors on a former airport runway.',
    location: 'Stormville, NY',
    state: 'NY',
    url: 'https://www.stormvilleairportfleamarket.com',
    time: '8am–4pm',
    recurrence: {
      type: 'dates',
      dates: [
        '2026-04-25', '2026-05-30', '2026-07-11',
        '2026-09-05', '2026-10-10', '2026-11-07',
      ],
    },
  },
  {
    id: 'long-island-vintage-flea',
    name: 'Long Island Vintage Flea Market',
    description: 'Monthly vintage and antique market featuring curated vendors from across Long Island.',
    location: 'Sayville, Long Island',
    state: 'NY',
    time: '9am–4pm',
    recurrence: { type: 'monthly', weekOfMonth: 2, dayOfWeek: 0 }, // 2nd Sunday
    seasonStart: 4,
    seasonEnd: 10,
  },
  {
    id: 'thriftcon-nyc',
    name: 'ThriftCon NYC',
    description: 'The ultimate thrift convention featuring vendors, panels, and vintage shopping.',
    location: 'Brooklyn, NY',
    state: 'NY',
    time: '10am–5pm',
    recurrence: {
      type: 'dates',
      dates: ['2026-08-01'],
    },
  },
  {
    id: 'vntg-con',
    name: 'VNTG CON',
    description: 'Vintage convention celebrating vintage fashion, culture, and community.',
    location: 'Manhattan, NY',
    state: 'NY',
    time: '10am–6pm',
    recurrence: {
      type: 'dates',
      dates: ['2026-03-14'],
    },
  },
  {
    id: 'distressed-fest-nyc',
    name: 'Distressed Fest NYC',
    description: 'Vintage and streetwear festival showcasing curated sellers and designers.',
    location: 'Brooklyn, NY',
    state: 'NY',
    time: '11am–6pm',
    recurrence: {
      type: 'dates',
      dates: ['2026-03-28'],
    },
  },
  {
    id: 'manhattan-vintage-show',
    name: 'Manhattan Vintage Show',
    description: 'Premier vintage clothing and antique textile show in NYC.',
    location: 'Manhattan, NY',
    state: 'NY',
    url: 'https://www.manhattanvintageshow.com',
    time: '10am–5pm',
    recurrence: {
      type: 'dates',
      dates: [
        '2026-04-18', '2026-05-16', '2026-09-19',
        '2026-10-17', '2026-11-21',
      ],
    },
  },

  // --- MASSACHUSETTS ---
  {
    id: 'brimfield-antique',
    name: 'Brimfield Antique Flea Market',
    description: 'Legendary outdoor antique show spanning a mile with thousands of dealers. Runs Tue–Sun during show weeks.',
    location: 'Brimfield, MA',
    state: 'MA',
    url: 'https://brimfieldantiquefleamarket.com',
    time: '6am–5pm',
    recurrence: {
      type: 'dates',
      dates: [
        '2026-05-12', '2026-05-13', '2026-05-14', '2026-05-15', '2026-05-16', '2026-05-17',
        '2026-07-14', '2026-07-15', '2026-07-16', '2026-07-17', '2026-07-18', '2026-07-19',
        '2026-09-08', '2026-09-09', '2026-09-10', '2026-09-11', '2026-09-12', '2026-09-13',
      ],
    },
  },
  {
    id: 'sowa-vintage-market',
    name: 'SoWa Vintage Market',
    description: "Open-air vintage and artisan market in Boston's South End arts district.",
    location: 'South End, Boston',
    state: 'MA',
    url: 'https://www.sowaboston.com',
    time: '10am–4pm',
    recurrence: { type: 'weekly', dayOfWeek: 0 }, // Sunday
    seasonStart: 5,
    seasonEnd: 10,
  },
  {
    id: 'retromania-boston',
    name: 'Retromania Boston',
    description: 'Vintage pop culture and retro collectibles show in the Boston area.',
    location: 'Boston, MA',
    state: 'MA',
    time: '10am–4pm',
    recurrence: {
      type: 'dates',
      dates: ['2026-02-21', '2026-02-22'],
    },
  },
  {
    id: 'found-vintage-market-boston',
    name: 'Found Vintage Market Boston',
    description: 'Curated vintage market featuring handpicked vendors and unique finds.',
    location: 'Boston, MA',
    state: 'MA',
    time: '10am–4pm',
    recurrence: {
      type: 'dates',
      dates: ['2026-03-01'],
    },
  },

  // --- NEW JERSEY ---
  {
    id: 'golden-nugget-flea',
    name: 'Golden Nugget Antique Flea Market',
    description: 'Year-round outdoor and indoor market with hundreds of dealers in antiques, collectibles, and vintage.',
    location: 'Lambertville, NJ',
    state: 'NJ',
    url: 'https://www.gnfmarket.com',
    time: '6am–4pm',
    recurrence: { type: 'weekly', dayOfWeek: 3 }, // Wednesday
  },
  {
    id: 'golden-nugget-weekend',
    name: 'Golden Nugget Weekend Market',
    description: 'Weekend extension of the famous Golden Nugget market with additional vendors.',
    location: 'Lambertville, NJ',
    state: 'NJ',
    url: 'https://www.gnfmarket.com',
    time: '8am–4pm',
    recurrence: { type: 'weekly', dayOfWeek: 6 }, // Saturday
  },
  {
    id: 'englishtown-auction',
    name: 'Englishtown Auction Sales',
    description: 'One of the oldest and largest open-air markets in New Jersey, since 1929.',
    location: 'Englishtown, NJ',
    state: 'NJ',
    url: 'https://www.englishtownauction.com',
    time: '7am–4pm',
    recurrence: { type: 'weekly', dayOfWeek: 6 }, // Saturday
  },
  {
    id: 'asbury-park-bazaar',
    name: 'Asbury Park Vintage Bazaar',
    description: 'Monthly curated vintage market on the Jersey Shore with fashion, vinyl, and collectibles.',
    location: 'Asbury Park, NJ',
    state: 'NJ',
    time: '10am–5pm',
    recurrence: { type: 'monthly', weekOfMonth: 1, dayOfWeek: 0 }, // 1st Sunday
    seasonStart: 4,
    seasonEnd: 10,
  },
  {
    id: 'time-travelers-vintage-expo',
    name: 'Time Travelers Vintage Expo',
    description: 'Large-scale vintage expo featuring clothing, accessories, and collectibles from multiple eras.',
    location: 'Edison, NJ',
    state: 'NJ',
    time: '10am–4pm',
    recurrence: {
      type: 'dates',
      dates: ['2026-07-18'],
    },
  },

  // --- PENNSYLVANIA ---
  {
    id: 'renningers-adamstown',
    name: "Renninger's Antique Market — Adamstown",
    description: 'Year-round indoor/outdoor antique market in the Antiques Capital of the USA.',
    location: 'Adamstown, PA',
    state: 'PA',
    url: 'https://renningers.net',
    time: '7:30am–4pm',
    recurrence: { type: 'weekly', dayOfWeek: 0 }, // Sunday
  },
  {
    id: 'renningers-extravaganza',
    name: "Renninger's Antique Extravaganza",
    description: 'Massive three-day event with 1,200+ dealers from across the country.',
    location: 'Adamstown, PA',
    state: 'PA',
    url: 'https://renningers.net',
    time: '7am–5pm',
    recurrence: {
      type: 'dates',
      dates: [
        '2026-04-23', '2026-04-24', '2026-04-25',
        '2026-06-25', '2026-06-26', '2026-06-27',
        '2026-09-24', '2026-09-25', '2026-09-26',
      ],
    },
  },
  {
    id: 'philly-flea',
    name: 'Philly Flea Markets',
    description: 'Monthly flea market featuring local vintage sellers, makers, and food trucks.',
    location: 'Philadelphia, PA',
    state: 'PA',
    url: 'https://www.phillyflea.com',
    time: '10am–5pm',
    recurrence: { type: 'monthly', weekOfMonth: 1, dayOfWeek: 6 }, // 1st Saturday
  },
  {
    id: 'philly-vintage-flea',
    name: 'Philly Vintage Flea',
    description: 'Large vintage flea market featuring curated vendors from the greater Philadelphia area.',
    location: 'Oaks, PA',
    state: 'PA',
    time: '9am–3pm',
    recurrence: {
      type: 'dates',
      dates: ['2026-03-29'],
    },
  },
  {
    id: 'punk-rock-flea-market-philly',
    name: 'Punk Rock Flea Market',
    description: 'DIY-focused flea market with vintage, punk, and alternative culture vendors.',
    location: 'Philadelphia, PA',
    state: 'PA',
    time: '10am–5pm',
    recurrence: {
      type: 'dates',
      dates: ['2026-04-17', '2026-04-18', '2026-04-19'],
    },
  },
  {
    id: 'drexel-vintage-antique-flea',
    name: 'Drexel Vintage & Antique Flea',
    description: 'Vintage and antique flea market hosted at Drexel University campus.',
    location: 'Philadelphia, PA',
    state: 'PA',
    time: '9am–4pm',
    recurrence: {
      type: 'dates',
      dates: ['2026-04-25'],
    },
  },
  {
    id: '717-vintage-fest',
    name: '717 Vintage Fest',
    description: 'Central PA vintage festival with curated sellers, food, and live music.',
    location: 'York, PA',
    state: 'PA',
    time: '10am–5pm',
    recurrence: {
      type: 'dates',
      dates: ['2026-05-30', '2026-05-31', '2026-11-14', '2026-11-15'],
    },
  },

  // --- VIRGINIA ---
  {
    id: 'richmond-vintage-market',
    name: 'Richmond Vintage Market',
    description: 'Monthly curated vintage market in the heart of RVA with clothing, vinyl, and home goods.',
    location: 'Richmond, VA',
    state: 'VA',
    time: '10am–4pm',
    recurrence: { type: 'monthly', weekOfMonth: 3, dayOfWeek: 6 }, // 3rd Saturday
  },
  {
    id: 'leesburg-vintage-village',
    name: 'Leesburg Vintage Village Market',
    description: 'Charming monthly vintage and antique market in historic downtown Leesburg.',
    location: 'Leesburg, VA',
    state: 'VA',
    time: '9am–4pm',
    recurrence: { type: 'monthly', weekOfMonth: 2, dayOfWeek: 6 }, // 2nd Saturday
    seasonStart: 3,
    seasonEnd: 11,
  },
  {
    id: 'old-town-alexandria-flea',
    name: 'Old Town Alexandria Flea Market',
    description: 'Weekend market with antiques, vintage finds, and local artisan goods near the Potomac.',
    location: 'Alexandria, VA',
    state: 'VA',
    time: '8am–3pm',
    recurrence: { type: 'weekly', dayOfWeek: 6 }, // Saturday
    seasonStart: 3,
    seasonEnd: 12,
  },

  // --- MARYLAND ---
  {
    id: 'annapolis-antique-show',
    name: 'Annapolis Antique & Vintage Market',
    description: 'Monthly market at the Annapolis Elks Lodge featuring quality antiques and vintage goods.',
    location: 'Annapolis, MD',
    state: 'MD',
    time: '9am–3pm',
    recurrence: { type: 'monthly', weekOfMonth: 1, dayOfWeek: 0 }, // 1st Sunday
  },
  {
    id: 'baltimore-vintage-expo',
    name: 'Baltimore Vintage Expo',
    description: 'Bi-monthly vintage fashion and collectibles expo in Baltimore.',
    location: 'Baltimore, MD',
    state: 'MD',
    url: 'https://www.baltimorevintageexpo.com',
    time: '10am–4pm',
    recurrence: {
      type: 'dates',
      dates: [
        '2026-02-14', '2026-05-17', '2026-06-13',
        '2026-08-08', '2026-10-10', '2026-12-12',
      ],
    },
  },
  {
    id: 'vintagepalooza-baltimore',
    name: 'Vintagepalooza',
    description: 'Baltimore vintage market with curated sellers, vintage fashion, and collectibles.',
    location: 'Baltimore, MD',
    state: 'MD',
    time: '10am–4pm',
    recurrence: {
      type: 'dates',
      dates: ['2026-03-22', '2026-04-06'],
    },
  },
  {
    id: 'bmore-flea',
    name: 'Bmore Flea',
    description: 'Bi-weekly Baltimore flea market with vintage, handmade, and local goods.',
    location: 'Baltimore, MD',
    state: 'MD',
    time: '10am–4pm',
    recurrence: {
      type: 'dates',
      dates: [
        '2026-03-29', '2026-04-20', '2026-05-04',
        '2026-05-18', '2026-06-01', '2026-06-15',
      ],
    },
  },
  {
    id: 'dc-flea-market',
    name: 'Georgetown Flea Market',
    description: 'Long-running Sunday flea market in Georgetown with antiques, vintage, and collectibles.',
    location: 'Georgetown, Washington D.C.',
    state: 'MD',
    url: 'https://www.georgetownfleamarket.com',
    time: '8am–4pm',
    recurrence: { type: 'weekly', dayOfWeek: 0 }, // Sunday
  },
];
