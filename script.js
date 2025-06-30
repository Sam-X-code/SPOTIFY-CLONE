console.log('lets write js.....');
let currentsong = new Audio();
let songs;


function timeconverter(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getsongs() {
    let a = await fetch("http://127.0.0.1:3000/SPOTIFY%20CLONE/songs/");
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/songs/`)[1])
        }
    }
    return songs;
}


const playmusic = (track, pause = false) => {
    // let audio = new Audio("/SPOTIFY%20CLONE/songs/"+track)
    currentsong.src = "/SPOTIFY%20CLONE/songs/" + track
    if (!pause) {
        currentsong.play()
        play.src = "pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track).replace(".mp3", " ")
}



async function main() {
    // get list of all the songs
    await getsongs()
    playmusic(songs[0], true)

    // show all songs in playlist
    let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0];
    songul.innerHTML="";
    for (const song of songs) {
        songul.innerHTML = songul.innerHTML + `<li><img class="invert" src="music.svg" alt="">
                            <div class="info">
                                <div>${song.replaceAll("%20", " ")}</div>
                                <div>Shivam Sachan</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="play.svg" alt="">
                            </div></li>`
    }

 // attach an event listener to each song
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    }); 


    // attach an event listener to play, next , PREVIOUS
    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play()
            play.src = "pause.svg"
        }
        else {
            currentsong.pause()
            play.src = "play.svg"
        }
    })
    // time updation
    currentsong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${timeconverter(currentsong.currentTime)}/${timeconverter(currentsong.duration)}`;
        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";

    })
    // seekbar click updation
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentsong.currentTime = ((currentsong.duration) * percent) / 100;
    })
    // add click efffect on hamburger
    document.querySelector(".hamburger").addEventListener("click", e => {
        document.querySelector(".left").style.left = 0 + "%"
    })
    // add click efffect for closing hamburger
    document.querySelector(".close").addEventListener("click", e => {
        document.querySelector(".left").style.left = -120 + "%"
    })
    // add event lisstener to next btn
    next.addEventListener("click",()=>{
        currentsong.pause
        console.log("next clicked");
        
        let index= songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if((index+1)<songs.length){
            playmusic(songs[index+1]);
        }
    })
    // add event lisstener to prev btn
    prev.addEventListener("click",()=>{
        currentsong.pause
        console.log("prev clicked");
        
        let index= songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if((index-1)>=0){
            playmusic(songs[index-1]);
        }
    })
    // add event to vol
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",e=>{
        currentsong.volume = parseInt(e.target.value) / 100;
    })
}
main()