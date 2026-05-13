import Swiper from './swiper.min.js';

function isCardCarousel(block) {
    return block.closest('.section')?.classList.contains('card-carousel');
}

function createSwiper(block) {
    if (!block.classList.contains('swiper')) {
        block.classList.add('swiper');
        const rows = Array.from(block.children);
        const swiperWrapper = document.createElement('div');
        swiperWrapper.classList.add('swiper-wrapper');

        if (isCardCarousel(block)) {
            rows.forEach((row) => {
                decorateCard(row);
                const slide = document.createElement('div');
                slide.classList.add('swiper-slide');
                slide.appendChild(row);
                swiperWrapper.append(slide);
            });
        } else {
            rows.forEach((row) => {
                row.classList.add('swiper-slide');
                swiperWrapper.append(row);
            });
        }

        block.append(swiperWrapper);
    }
}

/**
 * Decorate an existing carousel-card-item row into a card layout,
 * preserving all data-aue-* attributes for Universal Editor support.
 *
 * Cell indices (AEM EDS merges imageAlt into image cell as alt attr):
 * 0=image, 1=categoryLabel, 2=badgeImage, 3=title,
 * 4=description, 5=goToSiteLink, 6=goToSiteText,
 * 7=viewMoreLink, 8=viewMoreText, 9=wishlistImage
 */
function decorateCard(row) {
    const cells = [...row.children];
    row.classList.add('carousel-card');

    // -- Media wrapper: group cells 0, 1, 2 --
    const mediaWrap = document.createElement('div');
    mediaWrap.classList.add('carousel-card-media');

    if (cells[0]) {
        cells[0].classList.add('carousel-card-image');
        mediaWrap.appendChild(cells[0]);
    }
    if (cells[1]) {
        cells[1].classList.add('carousel-card-tag');
        mediaWrap.appendChild(cells[1]);
    }
    if (cells[2]) {
        cells[2].classList.add('carousel-card-badge');
        mediaWrap.appendChild(cells[2]);
    }

    // -- Content wrapper: group cells 3-9 --
    const contentWrap = document.createElement('div');
    contentWrap.classList.add('carousel-card-content');

    if (cells[3]) {
        cells[3].classList.add('carousel-card-title');
        contentWrap.appendChild(cells[3]);
    }
    if (cells[4]) {
        cells[4].classList.add('carousel-card-desc');
        contentWrap.appendChild(cells[4]);
    }
    if (cells[9]) {
        cells[9].classList.add('carousel-card-heart');
        contentWrap.appendChild(cells[9]);
    }

    // -- Buttons wrapper --
    const btnWrap = document.createElement('div');
    btnWrap.classList.add('carousel-card-buttons');

    // Go To Site button (cell 5 = URL, cell 6 = label)
    if (cells[5]) {
        const url = cells[5].textContent.trim();
        const text = cells[6]?.textContent?.trim() || 'GO TO SITE';
        if (url) {
            const a = document.createElement('a');
            a.classList.add('carousel-card-btn', 'carousel-card-btn-primary');
            a.href = url;
            a.textContent = text;
            cells[5].textContent = '';
            cells[5].appendChild(a);
        }
        cells[5].classList.add('carousel-card-btn-wrap');
        btnWrap.appendChild(cells[5]);
    }
    if (cells[6]) {
        cells[6].style.display = 'none';
        btnWrap.appendChild(cells[6]);
    }

    // View More button (cell 7 = URL, cell 8 = label)
    if (cells[7]) {
        const url = cells[7].textContent.trim();
        const text = cells[8]?.textContent?.trim() || 'VIEW MORE';
        if (url) {
            const a = document.createElement('a');
            a.classList.add('carousel-card-btn', 'carousel-card-btn-outline');
            a.href = url;
            a.textContent = text;
            cells[7].textContent = '';
            cells[7].appendChild(a);
        }
        cells[7].classList.add('carousel-card-btn-wrap');
        btnWrap.appendChild(cells[7]);
    }
    if (cells[8]) {
        cells[8].style.display = 'none';
        btnWrap.appendChild(cells[8]);
    }

    contentWrap.appendChild(btnWrap);

    // Append wrappers to row (all cells already moved into them)
    row.appendChild(mediaWrap);
    row.appendChild(contentWrap);
}

function swiperInit(block) {
    const nextBtn = document.createElement('div');
    nextBtn.classList.add('swiper-button-next');
    const prevBtn = document.createElement('div');
    prevBtn.classList.add('swiper-button-prev');
    const pagination = document.createElement('div');
    pagination.classList.add('swiper-pagination');

    const isCard = isCardCarousel(block);

    if (isCard) {
        // Place arrows on wrapper so they aren't clipped by overflow:hidden on block
        block.parentElement.append(nextBtn, prevBtn);
    } else {
        block.append(nextBtn, prevBtn);
    }

    // Place pagination after the block (outside Swiper container) so it doesn't affect arrow positioning
    block.parentElement.appendChild(pagination);

    const swiperConfig = {
        navigation: {
            nextEl: nextBtn,
            prevEl: prevBtn,
        },
        pagination: {
            el: pagination,
            clickable: true,
        },
        loop: false,
        autoplay: isCard ? false : { delay: 3000 },
        breakpoints: isCard
            ? {
                320: { slidesPerView: 1, slidesPerGroup: 1, spaceBetween: 16 },
                600: { slidesPerView: 2, slidesPerGroup: 2, spaceBetween: 16 },
                900: { slidesPerView: 3, slidesPerGroup: 3, spaceBetween: 20 },
                1200: { slidesPerView: 4, slidesPerGroup: 4, spaceBetween: 20 },
            }
            : {
                320: { slidesPerView: 1, slidesPerGroup: 1, spaceBetween: 15 },
                600: { slidesPerView: 1, slidesPerGroup: 1, spaceBetween: 15 },
                900: { slidesPerView: 1, slidesPerGroup: 1, spaceBetween: 15 },
                1200: { slidesPerView: 1, slidesPerGroup: 1, spaceBetween: 15 },
            },
    };

    return new Swiper(block, swiperConfig);
}


// function wrapImageInLink(block) {
//     if (block.classList.contains('services-carousel') || block.classList.contains('experience-carousel')) {
//         const slides = block.querySelectorAll('.swiper-slide');
//         slides.forEach(slide => {
//             const anchor = slide.querySelectorAll('p.button-container a');
//             const link = anchor.href;
//             const newAnchor = document.createElement('a');
//             newAnchor.href = link;

//             const picture = slide.querySelector('picture');
//             const imgWrapper = picture.parentElement;
//             newAnchor.append(picture);
//             imgWrapper.append(newAnchor);
//         })
//     }
// }


// --- Add this function for direct Swiper init on already correct markup ---
export function initSwiperOnly(block) {

    // Find the .swiper element (block may be a wrapper)
    const swiperEl = block.classList.contains('swiper') ? block : block.querySelector('.swiper');
    if (!swiperEl) return;
    // Use child selectors for navigation/pagination
    const nextBtn = swiperEl.querySelector('.swiper-button-next') || swiperEl.appendChild(document.createElement('div'));
    nextBtn.classList.add('swiper-button-next');
    const prevBtn = swiperEl.querySelector('.swiper-button-prev') || swiperEl.appendChild(document.createElement('div'));
    prevBtn.classList.add('swiper-button-prev');
    let pagination = swiperEl.querySelector('.swiper-pagination');
    if (!pagination) {
        pagination = document.createElement('div');
        pagination.classList.add('swiper-pagination');
        swiperEl.appendChild(pagination);
    }
    const swiperConfig = {
        navigation: {
            nextEl: nextBtn,
            prevEl: prevBtn,
        },
        pagination: {
            el: pagination,
            clickable: true,
        },
        breakpoints: {
            320: { slidesPerView: 1, slidesPerGroup: 1, spaceBetween: 15 },
            600: { slidesPerView: 1, slidesPerGroup: 1, spaceBetween: 15 },
            900: { slidesPerView: 2, slidesPerGroup: 2, spaceBetween: 16 },
            1200: { slidesPerView: 2, slidesPerGroup: 2, spaceBetween: 16 }
        },
        loop: false,
        observer: true,
        observeParents: true,
    };
    new Swiper(swiperEl, swiperConfig);
}


export default function decorate(block) {
    const isDesktop = window.matchMedia('(min-width: 900px)');

    createSwiper(block);
    // wrapImageInLink(block);

    // if (block.classList.contains('services-carousel') && block.classList.contains('experience-carousel') && isDesktop.matches) return;
    swiperInit(block);
}