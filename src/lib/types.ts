import { type SvelteComponent } from 'svelte';
import { type Icon } from 'lucide-svelte';

export type Company = {
    name: string,
    icon: typeof Icon
    street: string,
    zip: number,
    town: string,
    uuid: string
}

export type User = {
    uuid: string,
    firstname: string,
    email: string,
    phone: string,
    username: string,
    password: string
}

export type Session = {
    uuid: string,
    useruuid: string,
    token: string,
    expires: Date,
    perma: boolean
}