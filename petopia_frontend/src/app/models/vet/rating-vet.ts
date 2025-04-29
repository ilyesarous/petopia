export class RatingVet {
    idRating!: number;
    note: number = 0;
    comment!: string;
    userclientR!: User;
    uservetR!: User;
}

export class User {
    id_user!: number;
    name?: string;
    email?: string;
    phoneNumber?: string;
    locked?: boolean;
}