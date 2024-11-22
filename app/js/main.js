const data = {}
const sortSettings = {
	field: "price",
	ascending: false,
}
const filterSettings = {
	fields: ["isNew"],
}

const cart = {}

initPage()

function initPage() {
	initSlider()
	initFilterTogglers()
	initSortToggler()
	initCartBtn()
	initOverlayClick()
	initBurgerclick()
	initFilterBtn()
	initSortingTogglers()
	initCartBtns()
	initAddToCartBtns()
	getData()
	function initCartBtn() {
		const btn = document.querySelector(".header__cartBtn")
		const closeBtn = document.querySelector(".cart__close")

		btn.addEventListener("click", showCart)
		closeBtn.addEventListener("click", hideEveryThing)
		function showCart() {
			const overlay = document.querySelector(".overlay")
			const cart = document.querySelector(".cart")
			document.querySelector("body").classList.add("blocked")
			overlay.classList.add("active")
			cart.classList.add("active")
		}
	}
	function initOverlayClick() {
		const overlay = document.querySelector(".overlay")
		overlay.addEventListener("click", hideEveryThing)
	}
	function initBurgerclick() {
		const burger = document.querySelector(".header__burger")
		const menu = document.querySelector(".header__menu")
		burger.addEventListener("click", () => {
			burger.classList.toggle("active")
			menu.classList.toggle("active")
		})
	}
	function initFilterBtn() {
		const filterBtn = document.querySelector(".catalog__filterBtn")
		filterBtn.addEventListener("click", showFilterList)

		function showFilterList() {
			const filterWrapper = document.querySelector(".catalog__col")
			filterWrapper.classList.add("active")
			const overlay = document.querySelector(".overlay")
			overlay.classList.add("active")
			document.querySelector("body").classList.add("blocked")
		}
	}
	function initSlider() {
		const swiper = new Swiper(".banner__slider", {
			direction: "horizontal",
			loop: true,
			spaceBetween: 0,

			pagination: {
				el: ".banner__slider-pagination",
				clickable: true,
			},
			navigation: {
				nextEl: ".banner__button-next",
				prevEl: ".banner__button-prev",
			},
		})
	}
	function initFilterTogglers() {
		const togglers = document.querySelectorAll(".catalog__filter")
		togglers.forEach(item => {
			item.addEventListener("click", () => {
				item.classList.toggle("active")
				if (item.classList.contains("active")) {
					filterSettings.fields.push(item.getAttribute("data-filter"))
				} else {
					filterSettings.fields = filterSettings.fields.filter(e => e != item.getAttribute("data-filter"))
				}
				makeFilteredList()
			})
		})
	}
	function initSortToggler() {
		const sortBtn = document.querySelector(".catalog__sort-current")

		sortBtn.addEventListener("click", showSortList)
		function showSortList() {
			const softWrap = document.querySelector(".catalog__sort-list")
			const overlay = document.querySelector(".overlay")
			const ancoreCoords = document.querySelector(".catalog__sort-current").getBoundingClientRect()

			softWrap.classList.add("active")
			softWrap.style.top = `${ancoreCoords.top}px`
			softWrap.style.right = `${window.innerWidth - ancoreCoords.right}px`

			document.querySelector("body").classList.add("blocked")
			overlay.classList.add("active")
		}
	}
	function hideEveryThing() {
		hideSortList()
		hideCart()
		hideFilterList()

		function hideSortList() {
			const overlay = document.querySelector(".overlay")
			const softWrap = document.querySelector(".catalog__sort-list")

			overlay.classList.remove("active")
			softWrap.classList.remove("active")
			document.querySelector("body").classList.remove("blocked")
			softWrap.removeAttribute("style")
		}
		function hideFilterList() {
			const filterWrapper = document.querySelector(".catalog__col")
			const overlay = document.querySelector(".overlay")
			filterWrapper.classList.remove("active")
			overlay.classList.remove("active")
			document.querySelector("body").classList.remove("blocked")
		}
		function hideCart() {
			const overlay = document.querySelector(".overlay")
			const cart = document.querySelector(".cart")
			document.querySelector("body").classList.remove("blocked")
			overlay.classList.remove("active")
			cart.classList.remove("active")
		}
	}
	function initSortingTogglers() {
		const togglers = document.querySelectorAll(".catalog__sort-type")

		togglers.forEach(item => {
			item.addEventListener("click", () => {
				if (item.classList.contains("active")) return

				document.querySelector(".catalog__sort-type.active").classList.remove("active")
				sortSettings.field = item.getAttribute("data-sorting-field")
				sortSettings.ascending = item.getAttribute("data-sort-dir") == "asc"
				item.classList.add("active")

				makeSortedList()
			})
		})
	}
	function initAddToCartBtns() {
		const catalog = document.querySelector(".catalog__list")

		const addToCart = id => {
			cart[id] = cart[id] ? cart[id] + 1 : 1

			renderCart()
		}

		catalog.addEventListener("click", e => {
			const target = e.target

			if (e.target.closest(".card__btn")) {
				addToCart(e.target.closest(".card").getAttribute("data-id"))
			}
		})
	}
}

function getData() {
	const API = "https://67376796aafa2ef22233b7c6.mockapi.io/mockapi/items"
	axios
		.get(API)
		.then(response => {
			formatData(response.data)
		})
		.catch(error => console.log(error))

	function formatData(arr) {
		let obj = {}

		arr.forEach(e => {
			obj[e.id] = e
			obj[e.id].price = +obj[e.id].price
			obj[e.id].image = `./images/catalog/Photo (${obj[e.id].price % 6}).jpg` // имитация случайной картинки из имеющихся
		})

		data.idToDataMap = obj

		makeFilteredList()
		renderCart()
	}
}

function renderCart() {
	const cartList = document.querySelector(".cart__list")
	cartList.innerHTML = ""

	const renderItemInCart = (id, quantity) => {
		const curItem = data.idToDataMap[id]
		return `<div class="cart-item" data-id="${id}">
	<div class="cart-item__img">
		<img src="${curItem.image}" alt="">
	</div>
	<div class="cart-item__content">
		<div class="cart-item__title">${curItem.title}</div>
		<div class="cart-item__sum">${curItem.price * quantity}</div>
	</div>
	<div class="cart-item__counter">
		<div class="cart-item__counter-btn minus">
			<img src="./images/minus.svg" alt="">
		</div>
		<div class="cart-item__counter-curent">${quantity}</div>
		<div class="cart-item__counter-btn plus">
			<img src="./images/plus (1).svg" alt="">
		</div>
	</div>
	<div class="cart-item__delete">
		<img src="./images/x.svg" alt="">
	</div>
	<div class="cart-item__return">
		<img src="./images/repeat.svg" alt="">
	</div>
</div>`
	}

	for (let id in cart) {
		cartList.innerHTML += renderItemInCart(id, cart[id])
	}

	const countTotal = () => {
		const types = Object.keys(cart).length
		let total = 0

		for (let id in cart) {
			total += data.idToDataMap[id].price * cart[id]
		}

		document.querySelector(".header__cartBtn").innerHTML = types
		document.querySelector(".cart__bottom-total").innerHTML = total
		formatQuantity(".cart__total", types)
	}
	countTotal()
}
function makeFilteredList() {
	const filteredList = []
	const filterFields = filterSettings.fields
	const dataMap = data.idToDataMap

	for (let id in dataMap) {
		if (!filterFields.some(field => !dataMap[id][field])) {
			filteredList.push(dataMap[id])
		}
	}

	data.filteredList = filteredList
	formatQuantity(".catalog__counter", filteredList.length)
	makeSortedList()
}
function formatQuantity(elem, num) {
	const formatter = num => {
		const words = ["товар", "товара", "товаров"]
		const num100 = num % 100
		const num10 = num % 10
		if (num100 > 4 && num100 < 21) return `${num} ${words[2]}`
		if (num10 === 1) return `${num} ${words[0]}`
		if (num10 > 1 && num10 < 5) return `${num} ${words[1]}`
		return `${num} ${words[2]}`
	}
	document.querySelector(elem).innerHTML = formatter(num)
}
function makeSortedList() {
	const sortedList = [...data.filteredList].sort((a, b) => a.price - b.price)
	if (!sortSettings.ascending) {
		sortedList.reverse()
	}
	data.sortedList = sortedList

	renderCards()
	function renderCards() {
		const catalog = document.querySelector(".catalog__list")
		catalog.innerHTML = ""

		const renderCard = ({ id, title, image, price }) => {
			return `
					<div data-id="${id}" class="card">
				<div class="card__img">
					<img src="${image}" alt="" />
				</div>
				<div class="card__title">${title}</div>
				<div class="card__bottom">
					<div class="card__price">${price} ₽</div>
					<div class="card__btn">
						<img src="./images/plus.svg" alt="" />
					</div>
				</div>
			</div>
			
			`
		}

		data.sortedList.forEach(obj => {
			catalog.innerHTML += renderCard(obj)
		})
	}
}
function initCartBtns() {
	const cartElem = document.querySelector(".cart")

	const clearCart = () => {
		for (let id in cart) {
			delete cart[id]
		}
		renderCart()
	}
	const reduceQuantity = id => {
		cart[id]--
		if (!cart[id]) delete cart[id]
		renderCart()
	}
	const addQuantity = id => {
		cart[id]++
		renderCart()
	}
	const deleteItem = id => {
		delete cart[id]
		renderCart()
	}

	cartElem.addEventListener("click", e => {
		const target = e.target
		if (target.closest(".cart__clear")) {
			clearCart()
		} else if (target.closest(".minus")) {
			reduceQuantity(target.closest(".cart-item").getAttribute("data-id"))
		} else if (target.closest(".plus")) {
			addQuantity(target.closest(".cart-item").getAttribute("data-id"))
		} else if (target.closest(".cart-item__delete")) {
			deleteItem(target.closest(".cart-item").getAttribute("data-id"))
		}
	})
}
