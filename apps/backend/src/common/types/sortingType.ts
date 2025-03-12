export const sortingTypes = {
  asc: 'asc',
  desc: 'desc',
} as const;

export type SortingType = (typeof sortingTypes)[keyof typeof sortingTypes];
