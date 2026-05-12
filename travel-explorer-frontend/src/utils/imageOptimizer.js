export const imageOptimizer = {
    optimizeImageUrl(url, width = 400, height = 300) {
        // For demo purposes - in real app, use cloud image optimization service
        if (url.includes('unsplash') || url.includes('pixabay')) {
            return `${url}?w=${width}&h=${height}&fit=crop`;
        }
        return url;
    },

    lazyLoadImage(element) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });

        if (element) {
            observer.observe(element);
        }
    },

    preloadCriticalImages() {
        // Preload above-the-fold images
        const criticalImages = document.querySelectorAll('img[data-critical="true"]');
        criticalImages.forEach(img => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = img.dataset.src || img.src;
            document.head.appendChild(link);
        });
    }
};