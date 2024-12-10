export function loadPreloadResources(resources: Array<Record<string, string>>) {
    resources.forEach(resource => {
        const linkEl = document.createElement('link');
        Object.entries(resource).forEach(([key, value]) => {
            linkEl.setAttribute(key, value);
        });
        document.head.appendChild(linkEl);
    });
}