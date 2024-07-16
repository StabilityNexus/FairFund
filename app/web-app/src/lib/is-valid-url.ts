export function isValidURL(url: string | undefined): boolean {
    try {
        if (url) {
            new URL(url);
        }
        return true;
    } catch (error) {
        return false;
    }
}
