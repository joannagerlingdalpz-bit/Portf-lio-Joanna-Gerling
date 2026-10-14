document.addEventListener('DOMContentLoaded', () => {
	const track = document.querySelector('.carousel__track');
	const slides = Array.from(track.children);
	const prevButton = document.querySelector('.carousel__nav.prev');
	const nextButton = document.querySelector('.carousel__nav.next');
	const indicatorsContainer = document.querySelector('.carousel__indicators');

	let slideWidth = slides[0]?.getBoundingClientRect().width || 0;
	let currentIndex = 0;

	const setSlidePosition = () => {
		slideWidth = slides[0].getBoundingClientRect().width;
		slides.forEach((slide, index) => {
			slide.style.left = (slideWidth + 20) * index + 'px';
		});
		moveToIndex(currentIndex);
	};

	const moveToIndex = (index) => {
		const amount = (slideWidth + 20) * index;
		track.style.transform = `translateX(-${amount}px)`;
		updateIndicators(index);
	};

	const updateIndicators = (index) => {
		const dots = Array.from(indicatorsContainer.children);
		const groupIndex = Math.floor(index / 3);
		dots.forEach((d, i) => d.classList.toggle('active', i === groupIndex));
	};


	const numIndicators = Math.ceil(slides.length / 3);
	for (let i = 0; i < numIndicators; i++) {
		const btn = document.createElement('button');
		btn.className = 'carousel__indicator' + (i === 0 ? ' active' : '');
		btn.addEventListener('click', () => {
			currentIndex = i * 3;
			moveToIndex(currentIndex);
		});
		indicatorsContainer.appendChild(btn);
	}

	prevButton.addEventListener('click', () => {
		currentIndex = Math.max(0, currentIndex - 3);
		moveToIndex(currentIndex);
	});

	nextButton.addEventListener('click', () => {
		const maxIndex = slides.length - 3;
		currentIndex = Math.min(maxIndex, currentIndex + 3);
		moveToIndex(currentIndex);
	});

	
	let isDragging = false; let startX = 0; let currentTranslate = 0;

	const pointerDown = (e) => {
		isDragging = true; startX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
	};

	const pointerMove = (e) => {
		if (!isDragging) return;
		const x = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
		const diff = x - startX;
		track.style.transition = 'none';
		track.style.transform = `translateX(-${(slideWidth + 20) * currentIndex - diff}px)`;
	};

	const pointerUp = (e) => {
		if (!isDragging) return;
		isDragging = false; track.style.transition = '';
		const endX = e.type.includes('mouse') ? e.pageX : (e.changedTouches ? e.changedTouches[0].clientX : startX);
		const moved = endX - startX;
		if (moved < -40 && currentIndex < slides.length - 3) currentIndex += 3;
		if (moved > 40 && currentIndex > 0) currentIndex -= 3;
		moveToIndex(currentIndex);
	};

	track.addEventListener('mousedown', pointerDown);
	track.addEventListener('touchstart', pointerDown, {passive:true});
	window.addEventListener('mousemove', pointerMove);
	window.addEventListener('touchmove', pointerMove, {passive:true});
	window.addEventListener('mouseup', pointerUp);
	window.addEventListener('touchend', pointerUp);

	window.addEventListener('resize', setSlidePosition);


	setTimeout(setSlidePosition, 100);
});
