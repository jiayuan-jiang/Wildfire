import { defineStore } from 'pinia';

export const useToggleStore = defineStore('toggle', {
    state: () => ({
        isHidden: true,
    }),
    actions: {
        toggle() {
            console.log("use")
            this.isHidden = !this.isHidden;
            console.log(this.isHidden)
        },
    },
});