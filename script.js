const frm = document.querySelector('#frm');
const search = document.querySelector('#search');
const result = document.querySelector('#result');
const more = document.querySelector('#more');

/*
    https://lyricsovh.docs.apiary.io/#reference/0/lyrics-of-a-song/search
*/

const apiurl = 'https://api.lyrics.ovh/';

frm.addEventListener('submit', e=>{
     e.preventDefault();
     const songText = search.value.trim();
     if (!songText){
         alert('ป้อนข้อมูลไม่ถูกต้อง');
     }
     else{
         ft_searchLyrics(songText);
     }
});

async function ft_searchLyrics(songText){
    const res = await fetch(`${apiurl}/suggest/${songText}`);
    const songs = await res.json();
    ft_showResult(songs);
}

function ft_showResult(songs){
    result.innerHTML = 
    `<ul class="songs">
            ${songs.data.map(song=>
                `<li><span>
                    <strong>${song.artist.name}</strong> - ${song.title}
                </span>
                    <button class="btn"
                    data-artist="${song.artist.name}"
                    data-song="${song.title}"
                    >เนื้อเพลง</button>
                </li>`
            ).join('')}
    </ul>`;
    if ((songs.next) || (songs.prev)){
        more.innerHTML = `
        ${songs.prev ?`<button class="btn" onclick="ft_getMoreSongs('${songs.prev}')">ก่อนหน้า</button>` :""}
        ${songs.next ?`<button class="btn" onclick="ft_getMoreSongs('${songs.next}')">ถัดไป</button>` :""}
        `;
    }
    else{
        more.innerHTML = '';
    }
};

async function ft_getMoreSongs(songsUrl){
    const res = await fetch(`https://cors-anywhere.herokuapp.com/${songsUrl}`);
    const songs = await res.json();
    ft_showResult(songs);
};

result.addEventListener('click',e=>{
    const clickEl = e.target;
    if (clickEl.tagName == "BUTTON"){
        const artist = clickEl.getAttribute('data-artist');
        const song = clickEl.getAttribute('data-song');
        ft_getLyrics(artist, song);
    }
});

async function ft_getLyrics(artist, song){
    const res = await fetch(`${apiurl}/v1/${artist}/${song}`);
    const data = await res.json();
    const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g,"<br>");

    if (lyrics){
        result.innerHTML = `
        <h2><span>
            <strong>${artist}</strong>- ${song}
        </span></h2>
        <span>
            ${lyrics}
        </span>
        `;
    }
    else{
        result.innerHTML = `
        <h2><span>
            <strong>${artist}</strong>- ${song}
        </span></h2>
        <span>
            ไม่มีข้อมูลเนื้อเพลงนี้
        </span>
        `;
    }
    more.innerHTML = "";
};