export type Count = {
  _id: string | null;
  count: number;
};

export type Data = {
  status: Count[];
  types: Count[];
};
