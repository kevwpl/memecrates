import {type Writable, writable} from 'svelte/store';

export const currentCompany = writable(null);

export const broadcaster : Writable<string | null> = writable(null);