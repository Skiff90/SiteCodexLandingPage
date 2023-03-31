/* Проверка мобильного браузера */
let isMobile = { Android: function () { return navigator.userAgent.match(/Android/i); }, BlackBerry: function () { return navigator.userAgent.match(/BlackBerry/i); }, iOS: function () { return navigator.userAgent.match(/iPhone|iPad|iPod/i); }, Opera: function () { return navigator.userAgent.match(/Opera Mini/i); }, Windows: function () { return navigator.userAgent.match(/IEMobile/i); }, any: function () { return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows()); } };
/* Добавление класса touch для HTML если браузер мобильный */
function addTouchClass() {
	//Добавление класса _touch для HTML если браузер мобильный
	if (isMobile.any()) document.documentElement.classList.add('touch');
}
// Убрать класс из всех элементов массива
function removeClasses(array, className) {
	for (var i = 0; i < array.length; i++) {
		array[i].classList.remove(className);
	}
}

//Класс ibg 

function ibg() {

	let ibg = document.querySelectorAll("._ibg");

	for (var i = 0; i < ibg.length; i++) {
		if (ibg[i].querySelector('img')) {
			ibg[i].style.backgroundImage = 'url(' + ibg[i].querySelector('img').getAttribute('src') + ')';
		}
	}
}
ibg();

//=================================
// SPOLLERS==============================
const spollersArray = document.querySelectorAll('[data-spollers]');
if (spollersArray.length > 0) {
	// Получение обычных слойлеров
	const spollersRegular = Array.from(spollersArray).filter(function (item, index, self) {
		return !item.dataset.spollers.split(",")[0];
	});
	// Инициализация обычных слойлеров
	if (spollersRegular.length > 0) {
		initSpollers(spollersRegular);
	}

	// Получение слойлеров с медиа запросами
	const spollersMedia = Array.from(spollersArray).filter(function (item, index, self) {
		return item.dataset.spollers.split(",")[0];
	});

	// Инициализация слойлеров с медиа запросами
	if (spollersMedia.length > 0) {
		const breakpointsArray = [];
		spollersMedia.forEach(item => {
			const params = item.dataset.spollers;
			const breakpoint = {};
			const paramsArray = params.split(",");
			breakpoint.value = paramsArray[0];
			breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
			breakpoint.item = item;
			breakpointsArray.push(breakpoint);
		});

		// Получаем уникальные брейкпоинты
		let mediaQueries = breakpointsArray.map(function (item) {
			return '(' + item.type + "-width: " + item.value + "px)," + item.value + ',' + item.type;
		});
		mediaQueries = mediaQueries.filter(function (item, index, self) {
			return self.indexOf(item) === index;
		});

		// Работаем с каждым брейкпоинтом
		mediaQueries.forEach(breakpoint => {
			const paramsArray = breakpoint.split(",");
			const mediaBreakpoint = paramsArray[1];
			const mediaType = paramsArray[2];
			const matchMedia = window.matchMedia(paramsArray[0]);

			// Объекты с нужными условиями
			const spollersArray = breakpointsArray.filter(function (item) {
				if (item.value === mediaBreakpoint && item.type === mediaType) {
					return true;
				}
			});
			// Событие
			matchMedia.addListener(function () {
				initSpollers(spollersArray, matchMedia);
			});
			initSpollers(spollersArray, matchMedia);
		});
	}
	// Инициализация
	function initSpollers(spollersArray, matchMedia = false) {
		spollersArray.forEach(spollersBlock => {
			spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
			if (matchMedia.matches || !matchMedia) {
				spollersBlock.classList.add('_init');
				initSpollerBody(spollersBlock);
				spollersBlock.addEventListener("click", setSpollerAction);
			} else {
				spollersBlock.classList.remove('_init');
				initSpollerBody(spollersBlock, false);
				spollersBlock.removeEventListener("click", setSpollerAction);
			}
		});
	}
	// Работа с контентом
	function initSpollerBody(spollersBlock, hideSpollerBody = true) {
		const spollerTitles = spollersBlock.querySelectorAll('[data-spoller]');
		if (spollerTitles.length > 0) {
			spollerTitles.forEach(spollerTitle => {
				if (hideSpollerBody) {
					spollerTitle.removeAttribute('tabindex');
					if (!spollerTitle.classList.contains('_active')) {
						spollerTitle.nextElementSibling.hidden = true;
					}
				} else {
					spollerTitle.setAttribute('tabindex', '-1');
					spollerTitle.nextElementSibling.hidden = false;
				}
			});
		}
	}
	function setSpollerAction(e) {
		const el = e.target;
		if (el.hasAttribute('data-spoller') || el.closest('[data-spoller]')) {
			const spollerTitle = el.hasAttribute('data-spoller') ? el : el.closest('[data-spoller]');
			const spollersBlock = spollerTitle.closest('[data-spollers]');
			const oneSpoller = spollersBlock.hasAttribute('data-one-spoller') ? true : false;
			if (!spollersBlock.querySelectorAll('._slide').length) {
				if (oneSpoller && !spollerTitle.classList.contains('_active')) {
					hideSpollersBody(spollersBlock);
				}
				spollerTitle.classList.toggle('_active');
				_slideToggle(spollerTitle.nextElementSibling, 500);
			}
			e.preventDefault();
		}
	}
	function hideSpollersBody(spollersBlock) {
		const spollerActiveTitle = spollersBlock.querySelector('[data-spoller]._active');
		if (spollerActiveTitle) {
			spollerActiveTitle.classList.remove('_active');
			_slideUp(spollerActiveTitle.nextElementSibling, 500);
		}
	}
}
//========================================================================================================================================================
//SlideToggle
let _slideUp = (target, duration = 500) => {
	if (!target.classList.contains('_slide')) {
		target.classList.add('_slide');
		target.style.transitionProperty = 'height, margin, padding';
		target.style.transitionDuration = duration + 'ms';
		target.style.height = target.offsetHeight + 'px';
		target.offsetHeight;
		target.style.overflow = 'hidden';
		target.style.height = 0;
		target.style.paddingTop = 0;
		target.style.paddingBottom = 0;
		target.style.marginTop = 0;
		target.style.marginBottom = 0;
		window.setTimeout(() => {
			target.hidden = true;
			target.style.removeProperty('height');
			target.style.removeProperty('padding-top');
			target.style.removeProperty('padding-bottom');
			target.style.removeProperty('margin-top');
			target.style.removeProperty('margin-bottom');
			target.style.removeProperty('overflow');
			target.style.removeProperty('transition-duration');
			target.style.removeProperty('transition-property');
			target.classList.remove('_slide');
		}, duration);
	}
}
let _slideDown = (target, duration = 500) => {
	if (!target.classList.contains('_slide')) {
		target.classList.add('_slide');
		if (target.hidden) {
			target.hidden = false;
		}
		let height = target.offsetHeight;
		target.style.overflow = 'hidden';
		target.style.height = 0;
		target.style.paddingTop = 0;
		target.style.paddingBottom = 0;
		target.style.marginTop = 0;
		target.style.marginBottom = 0;
		target.offsetHeight;
		target.style.transitionProperty = "height, margin, padding";
		target.style.transitionDuration = duration + 'ms';
		target.style.height = height + 'px';
		target.style.removeProperty('padding-top');
		target.style.removeProperty('padding-bottom');
		target.style.removeProperty('margin-top');
		target.style.removeProperty('margin-bottom');
		window.setTimeout(() => {
			target.style.removeProperty('height');
			target.style.removeProperty('overflow');
			target.style.removeProperty('transition-duration');
			target.style.removeProperty('transition-property');
			target.classList.remove('_slide');
		}, duration);
	}
}
let _slideToggle = (target, duration = 500) => {
	if (target.hidden) {
		return _slideDown(target, duration);
	} else {
		return _slideUp(target, duration);
	}
}

//========================================================================================================================================================
/*
Для родителя слойлеров пишем атрибут data-spollers
Для заголовков слойлеров пишем атрибут data-spoller
Если нужно включать\выключать работу спойлеров на разных размерах экранов
пишем параметры ширины и типа брейкпоинта.
Например:
data-spollers="992,max" - спойлеры будут работать только на экранах меньше или равно 992px
data-spollers="768,min" - спойлеры будут работать только на экранах больше или равно 768px

Если нужно что бы в блоке открывался болько один слойлер добавляем атрибут data-one-spoller
*/


// Email validation


const EMAIL_REGEXP = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;
const input = document.querySelector('.footer-left__input');
const button = document.querySelector('.footer-left__button');

function isEmailValid(value) {
	return EMAIL_REGEXP.test(value);
}

button.addEventListener('click', function (event) {
	if (isEmailValid(input.value)) {
		input.style.color = 'green';
	} else {
		input.style.color = 'red';
		event.preventDefault();
		input.value = "Wrong Email!"
	}

})
document.addEventListener("click", function (e) {
	const targetElement = e.target;
	if (!targetElement.closest('.footer-left__button') && !targetElement.closest('.footer-left__input')) {
		input.value = "";
		input.style.color = `rgba(47, 47, 47, 0.36)`;
	}
})
//==========================================


//firs section active subitem================

document.addEventListener('click', function (e) {
	let targetElement = e.target;
	if (isMobile.any()) {
		if (targetElement.classList.contains('first__sub') || targetElement.classList.contains('second__sub')) {
			targetElement.classList.toggle('_active')
		}
		if (targetElement.closest('.first__sub')) {
			document.querySelector('.first__sub').classList.toggle('_active');
		}
		if (targetElement.closest('.second__sub')) {
			document.querySelector('.second__sub').classList.toggle('_active');
		}
	}
})



//===================

window.addEventListener("load", function (e) {

	const firstSection = document.querySelector('.page__expirience');
	firstSection.classList.add('_active');
	//Смена категорий=================================
	let categoriesList = document.querySelector('.hey__buttons');
	categoriesList.addEventListener('click', function (e) {
		const targetElement = e.target;
		let categoriesItem = document.querySelectorAll('.hey__button');
		for (var i = 0; i < categoriesItem.length; i++) {
			categoriesItem[i].classList.remove('_active');
		}
		if (!targetElement.closest('.hey__button').classList.contains('_active')) {
			targetElement.closest('.hey__button').classList.add('_active');
		};
		e.preventDefault();
		changeArtist(targetElement);
	});
	//смена содержимого категорий
	function changeArtist(e) {
		let atrId = e.getAttribute('id');
		let image = document.querySelector('.hey-item__image');
		let artist = document.querySelector('.hey-item__content');
		if (atrId == 'suni') {
			while (image.firstChild) {
				image.removeChild(image.firstChild)
			}
			while (artist.firstChild) {
				artist.removeChild(artist.firstChild)
			}
			getArtistAtr('suni');
		}
		if (atrId == 'colin') {
			while (image.firstChild) {
				image.removeChild(image.firstChild)
			}
			while (artist.firstChild) {
				artist.removeChild(artist.firstChild)
			}
			getArtistAtr('colin');
		}
		if (atrId == 'jack') {
			while (image.firstChild) {
				image.removeChild(image.firstChild)
			}
			while (artist.firstChild) {
				artist.removeChild(artist.firstChild)
			}
			getArtistAtr('jack');
		}
	}


	//формирование категорий
	function loadArtist(data, atr) {

		const artist = document.querySelector('.hey-item__content');
		const image = document.querySelector('.hey-item__image');

		data.artist.forEach(item => {
			if (item.id == atr) {
				const artistSubtext = item.subtext;
				const artistImage = item.image;
				const artistTitle = item.title;
				const artistText = item.text;

				let imageTemplate = `<img class="animate__animated 
				animate__pulse" src="img/hey/${artistImage}" alt="">`;
				let artistTemplate = `	<div class="hey-item__subtext animate__animated 
				animate__pulse">${artistSubtext}</div>
			<div class="hey-item__title animate__animated 
			animate__pulse">${artistTitle}</div>
			<div class="hey-item__text animate__animated 
			animate__pulse">${artistText}</div>`;

				artist.insertAdjacentHTML('beforeEnd', artistTemplate);
				image.insertAdjacentHTML('beforeEnd', imageTemplate);
			}
		});

	};
	//запрос содержимого категорий
	async function getArtistAtr(atr) {
		const file = "js/json/artist.json";
		let response = await fetch(file, {
			method: "GET"
		});
		if (response.ok) {
			let result = await response.json();
			loadArtist(result, atr);

		} else {
			alert("Ошибка");
		}
	};
	getArtistAtr('jack');
	let headerScroll = pageYOffset;
	document.addEventListener('scroll', function () {
		//Animation scroll=================================
		const animItems = document.querySelectorAll('._animeItem');

		if (animItems.length > 0) {
			function animOnScroll(params) {
				for (let index = 0; index < animItems.length; index++) {
					const animItem = animItems[index];
					const animItemHeight = animItem.offsetHeight;
					const animItemOffset = ofsset(animItem).top;
					const animStart = 4;

					let animItemPoint = window.innerHeight - animItemHeight / animStart;
					if (animItemHeight > window.innerHeight) {
						animItemPoint = window.innerHeight - window.innerHeight / animStart;
					}

					if ((pageYOffset > animItemOffset - animItemPoint) && pageYOffset < (animItemOffset + animItemHeight)) {

						if (!animItem.classList.contains('_active')) {
							animItem.classList.add('_active');
						}
					} else {
						animItem.classList.remove('_active');
					}
				}
			}
			function ofsset(el) {
				const rect = el.getBoundingClientRect(),
					scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
					scrollTop = window.pageYOffset || document.documentElement.scrollTop;
				return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
			}
		}
		animOnScroll();
		//====================================================
		//Header fix

		const headerElement = document.querySelector('.header');

		const callback = function (entries, observer) {
			if (entries[0].isIntersecting) {
				headerElement.classList.remove('_scroll');
			} else {
				headerElement.classList.add('_scroll');
			}
		};

		const headerObserver = new IntersectionObserver(callback);
		headerObserver.observe(headerElement);
		const headerWrapper = document.querySelector('.header__wrapper');
		if (pageYOffset > headerScroll) {
			headerWrapper.classList.add('_hide');
		} else {
			headerWrapper.classList.remove('_hide');
		}
		headerScroll = pageYOffset;
		//==========================================================
	})
	//==================================================================
	//Добавление коллескций
	//формирование коллекций
	function loadCollection(data) {
		const collections = document.querySelector('.browse__body');
		data.collection.forEach(item => {

			const collectionImage = item.image;
			const collectiontText = item.text;

			let collectionTemplate = `	<div class="browse-body__item animate__animated 
			animate__pulse">
					<div class="browse-body__image _ibg">
						<img src="img/browse/${collectionImage}" alt="image">
					</div>
					<a href="#" class="browse-body__text">${collectiontText}</a>
				</div>`;

			collections.insertAdjacentHTML('beforeEnd', collectionTemplate);
		});
	};

	//запрос содержимого коллекций
	async function getCollection() {
		const file = "js/json/collection.json";
		let response = await fetch(file, {
			method: "GET"
		});
		if (response.ok) {
			let result = await response.json();
			loadCollection(result);

		} else {
			alert("Ошибка");
		}
	};
	//Добавление коллекций по клику 
	let collectionButton = document.querySelector('.browse__button');
	collectionButton.addEventListener('click', function () {
		collectionButton.classList.add('_miss');
		setTimeout(getCollection, 800);
	})
	//==================================================================
	//Добавление nft
	//формирование nft
	function loadNft(data) {
		const nft = document.querySelector('.top-Nft__body');
		data.topnft.forEach(item => {

			const nftImage = item.image;
			const nftName = item.name;
			const nftColor = item.color;

			let nftTemplate = `<div class="top-Nft-body__item animate__animated 
			animate__pulse">
			<div class="top-Nft-body__image _ibg">
				<img src="img/topNfts/${nftImage}" alt="image">
			</div>
			<div class="top-Nft-body__info info-Nft">
				<div class="info-Nft__text">
					<div class="info-Nft__name">${nftName}</div>
					<div class="info-Nft__color">${nftColor}</div>
				</div>
				<div class="info-Nft__icons">
					<a href="" class="_icon-look"></a>
					<a href="" class="_icon-handle"></a>
				</div>
			</div>
		</div>`;

			nft.insertAdjacentHTML('beforeEnd', nftTemplate);
		});
	};

	//запрос содержимого коллекций
	async function getNft() {
		const file = "js/json/topnft.json";
		let response = await fetch(file, {
			method: "GET"
		});
		if (response.ok) {
			let result = await response.json();
			loadNft(result);

		} else {
			alert("Ошибка");
		}
	};
	//Добавление коллекций по клику
	let nftButton = document.querySelector('.top-Nft__button');
	nftButton.addEventListener('click', function () {
		nftButton.classList.add('_miss');
		setTimeout(getNft, 800);
	})
})

//==================================================
///BurgerMenu============================================
var burger = document.querySelector(".icon-menu");
var burgerBody = document.querySelector(".header__menu")
burger.addEventListener("click", function (e) {
	burger.classList.toggle("menu-open");
	burgerBody.classList.toggle("_active")
	document.querySelector('.header__button').classList.toggle('_active');
	document.querySelector('.header__socials').classList.toggle('_active');
}
)
