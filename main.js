/*
    1 Render song 
    2 Scroll top
    3 Play /  pause / seek
    4 CD rotate
    5 Next / prev
    6 Random
    7 Next / repeat when ended
    8 Active song 
    9 Scroll active song into view
    10 Play song when click
*/

const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const cd = $('.cd')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const song = $('.song')
const playlist = $('.playlist')

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem('PLAYER_STORAGE_KEY')) || {},
    songs: [
        {
            name: "Đế Vương",
            singer: "Đình Dũng,ACV",
            path: "./assets/music/song1.mp3",
            image: "./assets/img/img1.jpg"
        },
        {
            name: "Cưới Thôi",
            singer: "Masew,Masiu,B Ray,TAP",
            path: "./assets/music/song2.mp3",
            image: "./assets/img/img2.jpg"
        },
        {
            name: "Ái Nộ",
            singer: "Masew,Khôi Vũ",
            path: "./assets/music/song3.mp3",
            image: "./assets/img/img3.jpg"
        },
        {
            name: "Muộn rồi mà sao còn ",
            singer: "Sơn Tùng M-TP",
            path: "./assets/music/song4.mp3",
            image: "./assets/img/img4.jpg"
        },
        {
            name: "Độ Tộc 2 ",
            singer: "Masew,Pháo,Phúc Du,Phùng Thanh Độ",
            path: "./assets/music/song5.mp3",
            image: "./assets/img/img5.jpg"
        },
        {
            name: "Có Hẹn Với Thanh Xuân ",
            singer: "MONSTAR",
            path: "./assets/music/song6.mp3",
            image: "./assets/img/img6.jpg"
        },
        {
            name: "Phận Duyên Lỡ Làng",
            singer: "Phát Huy T4,Truzg",
            path: "./assets/music/song7.mp3",
            image: "./assets/img/img7.jpg"
        },
        {
            name: "Cao Ốc 20",
            singer: "B Ray,Đạt G",
            path: "./assets/music/song8.mp3",
            image: "./assets/img/img8.jpg"
        },
        {
            name: "Hãy Trao Cho Anh",
            singer: "Sơn Tùng M-TP, Snoop Dogg",
            path: "./assets/music/song9.mp3",
            image: "./assets/img/img9.jpg"
        },
        {
            name: "Sài Gòn Đâu Có Lạnh",
            singer: "Changg,LeWiuy",
            path: "./assets/music/song10.mp3",
            image: "./assets/img/img10.jpg"
        },
    ],
    setConfig(key, value) {
        this.config[key] = value
        localStorage.setItem('PLAYER_STORAGE_KEY', JSON.stringify(this.config))
    },
    render() {
        const html = this.songs.map((song, index) => {
            return `
            <div class="song ${this.currentIndex === index ? 'active' : ''}" data-index="${index}">
                <div class="thumb" 
                    style="background-image: url(${song.image})">
                </div>
    
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
            
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `
        })
        playlist.innerHTML = html.join('')
        randomBtn.classList.toggle('active', this.isRandom)
        repeatBtn.classList.toggle('active', this.isRepeat)
    },
    defineProperty() {
        Object.defineProperty(this, 'currentSong', {
            get() {
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvent() {
        const cdWidth = cd.offsetWidth
        // xu ly cd quay /  dung
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 10000,
            iterations: Infinity
        })
        cdThumbAnimate.pause()

        // xu ly phong to thu nho
        document.addEventListener('scroll', () => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newWidth = cdWidth - scrollTop
            cd.style.width = newWidth > 0 ? newWidth + 'px' : 0
            cd.style.opacity = newWidth / cdWidth
        })
        //  xu ly khi click
        playBtn.addEventListener('click', () => {
            if (this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        })
        // khi click play
        audio.addEventListener('play', () => {
            this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
        })
        // khi click pause
        audio.addEventListener('pause', () => {
            this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        })

        // thay doi tien do bai hat
        audio.addEventListener('timeupdate', () => {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }
        })

        // xu ly khi tua bai hat
        progress.addEventListener('input', (event) => {
            let newValue = event.target.value
            const seekTime = (audio.duration * newValue) / 100
            console.log(seekTime)
            audio.currentTime = seekTime
        })

        // khi bam next
        nextBtn.addEventListener('click', () => {
            if (this.isRandom) {
                this.randomSong()
            } else {
                this.nextSong()
            }
            audio.play()
            this.activeSong()
            this.scrollToActiveSong()
        })
        // khi bam prev
        prevBtn.addEventListener('click', () => {
            if (this.isRandom) {
                this.randomSong()
            } else {
                this.prevSong()
            }
            audio.play()
            this.activeSong()
            this.scrollToActiveSong()
        })
        // xu ly nut random
        randomBtn.addEventListener('click', () => {
            this.isRandom = !this.isRandom
            this.setConfig('isRandom', this.isRandom)
            randomBtn.classList.toggle('active', this.isRandom)
        })
        // xu ly next bai hat khi ket thuc
        audio.addEventListener('ended', () => {
            if (this.isRepeat) {
                audio.play()
            } else {
                nextBtn.click();
            }
        })
        // xu ly nut repeat
        repeatBtn.addEventListener('click', () => {
            this.isRepeat = !this.isRepeat
            this.setConfig('isRepeat', this.isRepeat)
            repeatBtn.classList.toggle('active', this.isRepeat)
        })
        //lang nghe hanh vi click vao playlist 
        playlist.addEventListener('click', (e) => {
            const songNode = e.target.closest('.song:not(.active)')
            if (songNode || e.target.closest('.option')) {
                if (songNode) {
                    this.currentIndex = +songNode.dataset.index
                    this.loadCurrentSong()
                    this.activeSong()
                    audio.play()
                }
            }
        })
    },
    loadConfig() {
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },
    scrollToActiveSong() {
        console.log(this.currentIndex)
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: `${this.currentIndex < 3 ? 'center' : 'nearest'}`,
            })
        }, 200)
    },
    activeSong() {
        const songs = $$('.song')
        for (let i = 0; i < songs.length; i++) {
            const isActive = songs[i].classList.contains('active')
            if (isActive && this.currentIndex !== i) {
                songs[i].classList.remove('active')
            }
            if (this.currentIndex === i) {
                songs[i].classList.add('active')
            }
        }
    },
    randomSong() {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    nextSong() {
        this.currentIndex++
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong() {
        this.currentIndex--
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },
    loadCurrentSong() {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },
    start() {
        this.loadConfig()

        this.defineProperty()

        this.handleEvent()

        this.loadCurrentSong()

        this.render()

    }

}

app.start()