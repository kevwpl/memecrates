import { type SvelteComponent } from 'svelte';
import { type Icon } from 'lucide-svelte';

export type Company = {
    name: string,
    icon: typeof Icon
    street: string,
    zip: number,
    town: string,
    uuid: string,
    uid: string
}

export type User = {
    uuid: string,
    firstname: string,
    lastname: string,
    email: string,
    phone: string,
    username: string,
    password: string,
    avatar: string
}

export type Session = {
    uuid: string,
    useruuid: string,
    token: string,
    expires: Date,
    perma: boolean
}

export type Customer = {
    uuid: string,
    name: string,
    street: string,
    zip: number,
    town: string,
    uid?: string,
    company: string,
}

export type Service = {
    uuid: string;
    name: string;
    price: number;
    company: string;
};