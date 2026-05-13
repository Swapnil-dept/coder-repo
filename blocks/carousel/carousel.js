import Swiper from './swiper.min.js';

function isCardCarousel(block) {
    return block.closest('.section')?.classList.contains('card-carousel');
}

function createSwiper(block) {
    if (!block.classList.contains('swiper')) {
        const rows = Array.from(block.children);
        const swiperWrapper = document.createElement('div');
        swiperWrapper.classList.add('swiper-wrapper');

        if (isCardCarousel(block)) {
            rows.forEach((row) => {
                const slide = document.createElement('div');
                slide.classList.add('swiper-slide');
                slide.appendChild(buildCard(row));
                swiperWrapper.append(slide);
            });
            // Remove original unprocessed rows from DOM
            rows.forEach((row) => row.remove());
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
 * Build a card element from a carousel-card-item row.
 * AEM EDS merges imageAlt into image cell (as alt attr), so actual cells:
 * 0=image, 1=categoryLabel, 2=badgeImage, 3=title,
 * 4=description, 5=goToSiteLink, 6=goToSiteText,
 * 7=viewMoreLink, 8=viewMoreText, 9=wishlistImage
 */
function buildCard(row) {
    const cells = [...row.children];
    const getText = (i) => cells[i]?.textContent?.trim() || '';
    const getLink = (i) => {
        const a = cells[i]?.querySelector('a');
        return a ? a.href : getText(i);
    };

    const card = document.createElement('article');
    card.classList.add('carousel-card');

    // -- Image wrapper --
    const mediaWrap = document.createElement('div');
    mediaWrap.classList.add('carousel-card-media');

    const picture = cells[0]?.querySelector('picture');
    if (picture) mediaWrap.appendChild(picture);

    const categoryLabel = getText(1);
    if (categoryLabel) {
        const tag = document.createElement('span');
        tag.classList.add('carousel-card-tag');
        tag.textContent = categoryLabel;
        mediaWrap.appendChild(tag);
    }

    const badgePic = cells[2]?.querySelector('picture');
    if (badgePic) {
        const badgeWrap = document.createElement('span');
        badgeWrap.classList.add('carousel-card-badge');
        badgeWrap.appendChild(badgePic);
        mediaWrap.appendChild(badgeWrap);
    }

    card.appendChild(mediaWrap);

    // -- Content --
    const content = document.createElement('div');
    content.classList.add('carousel-card-content');

    const title = getText(3);
    if (title) {
        const h3 = document.createElement('h3');
        h3.classList.add('carousel-card-title');
        h3.textContent = title;
        content.appendChild(h3);
    }

    const descHTML = cells[4]?.innerHTML?.trim() || '';
    if (descHTML) {
        const desc = document.createElement('div');
        desc.classList.add('carousel-card-desc');
        desc.innerHTML = descHTML;
        content.appendChild(desc);
    }

    // Wishlist image
    const wishlistPic = cells[9]?.querySelector('picture');
    if (wishlistPic) {
        const wishlistWrap = document.createElement('span');
        wishlistWrap.classList.add('carousel-card-heart');
        wishlistWrap.setAttribute('aria-label', 'Add to wishlist');
        wishlistWrap.appendChild(wishlistPic);
        content.appendChild(wishlistWrap);
    }

    // Buttons
    const btnWrap = document.createElement('div');
    btnWrap.classList.add('carousel-card-buttons');

    const goToSiteLink = getLink(5);
    const goToSiteText = getText(6) || 'GO TO SITE';
    if (goToSiteLink) {
        const a = document.createElement('a');
        a.classList.add('carousel-card-btn', 'carousel-card-btn-primary');
        a.href = goToSiteLink;
        a.textContent = goToSiteText;
        btnWrap.appendChild(a);
    }

    const viewMoreLink = getLink(7);
    const viewMoreText = getText(8) || 'VIEW MORE';
    if (viewMoreLink) {
        const a = document.createElement('a');
        a.classList.add('carousel-card-btn', 'carousel-card-btn-outline');
        a.href = viewMoreLink;
        a.textContent = viewMoreText;
        btnWrap.appendChild(a);
    }

    content.appendChild(btnWrap);
    card.appendChild(content);

    return card;
}

function swiperInit(block) {
    const nextBtn = document.createElement('div');
    nextBtn.classList.add('swiper-button-next');
    const prevBtn = document.createElement('div');
    prevBtn.classList.add('swiper-button-prev');
    const pagination = document.createElement('div');
    pagination.classList.add('swiper-pagination');
    block.append(nextBtn, prevBtn);

    // Place pagination after the block (outside Swiper container) so it doesn't affect arrow positioning
    block.parentElement.appendChild(pagination);

    const isCard = isCardCarousel(block);

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