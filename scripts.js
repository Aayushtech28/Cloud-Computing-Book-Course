// scripts.js
document.addEventListener('DOMContentLoaded', () => {
    const heroImage = document.querySelector('.hero-image img');
    window.addEventListener('scroll', () => {
        const scrollTop = document.documentElement.scrollTop;
        heroImage.style.transform = `translateY(${scrollTop * 0.3}px)`;
    });

    // GSAP animations
    gsap.from('.hero-text h2', { duration: 1, y: -50, opacity: 0, ease: 'bounce' });
    gsap.from('.hero-text p', { duration: 1, y: 50, opacity: 0, delay: 0.5 });
    gsap.from('.hero-image img', { duration: 1, scale: 0.8, opacity: 0, delay: 1 });

    // PDF Viewer Modal
    const pdfModal = document.getElementById('pdf-modal');
    const pdfViewer = document.getElementById('pdf-viewer');
    const closeButton = document.getElementsByClassName('close-button')[0];

    const pdfLinks = document.querySelectorAll('a[data-pdf]');
    pdfLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const pdfUrl = link.getAttribute('data-pdf');
            openPDFModal(pdfUrl);
        });
    });

    closeButton.onclick = () => {
        pdfModal.style.display = 'none';
    };

    window.onclick = (event) => {
        if (event.target === pdfModal) {
            pdfModal.style.display = 'none';
        }
    };

    function openPDFModal(pdfUrl) {
        pdfModal.style.display = 'block';
        pdfjsLib.getDocument(pdfUrl).promise.then(pdf => {
            let pdfViewer = new pdfjsViewer.PDFViewer({
                container: document.getElementById('pdf-viewer')
            });
            pdf.getPage(1).then(page => {
                pdfViewer.setDocument(pdf);
                let desiredWidth = pdfViewer.container.clientWidth;
                let zoom = desiredWidth / page.getViewport({scale: 1}).width;
                let scaledViewport = page.getViewport({scale: zoom});
                pdfViewer.currentScaleValue = zoom;
                pdfViewer._setScale(zoom, true);
                pdfViewer.setViewerContainer({
                    viewArea: document.getElementById('pdf-viewer')
                });
                page.render({
                    viewBox: page.getViewport({scale: zoom}).viewBox,
                    canvasContext: pdfViewer.canvas.getContext('2d'),
                    viewport: scaledViewport
                });
            });
        }).catch(err => {
            console.error('Error opening PDF:', err);
        });
    }
});
