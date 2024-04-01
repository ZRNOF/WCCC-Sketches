let dir = 0

let scrollTimer
const handleScroll = (event) => {
	dir = Math.sign(event.deltaY)
	clearTimeout(scrollTimer)
	scrollTimer = setTimeout(() => (dir = 0), 50)
}

document.addEventListener("wheel", handleScroll)

export { dir }
