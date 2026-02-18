export const toApiDate = (value: Date | null): string | null => {
  if (!value) {
    return null;
  }

  return value.toISOString().replace('Z', '');
};

export const fromApiDate = (value: string | null | undefined): Date | null => {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
};
