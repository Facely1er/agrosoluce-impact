// TODO[directory-filters]: central EUDR commodity type & labels

export type EudrCommodity =
  | 'cocoa'
  | 'coffee'
  | 'palm_oil'
  | 'rubber'
  | 'soy'
  | 'cattle'
  | 'wood';

export const EUDR_COMMODITIES_IN_SCOPE: { id: EudrCommodity; label: string }[] = [
  { id: 'cocoa', label: 'Cocoa' },
  { id: 'coffee', label: 'Coffee' },
  { id: 'palm_oil', label: 'Palm oil' },
  { id: 'rubber', label: 'Natural rubber' },
  { id: 'soy', label: 'Soy' },
  { id: 'cattle', label: 'Cattle (beef/leather)' },
  { id: 'wood', label: 'Wood / timber' }
];

