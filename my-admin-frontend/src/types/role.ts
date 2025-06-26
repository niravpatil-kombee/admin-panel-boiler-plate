export interface Role {
    _id: string;
    name: string;
    permissions: { _id: string; name: string }[];
}
