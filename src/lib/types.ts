import { type SvelteComponent } from 'svelte';
import { type Icon } from 'lucide-svelte';

export type Company = {
    name: string,
    icon: typeof Icon
    street: string,
    zip: number,
    town: string,
    uid: string
}