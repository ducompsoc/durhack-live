const obs = new (<any>window).OBSWebSocket();
obs.connect({ address: '127.0.0.1:4444', password: 'bF5cG8lL8hN4eP7h' }).then(() => {
    console.log('Connected to OBS.');
});

let isEqual: (a: any, b: any) => boolean = (<any>window)._.isEqual;

interface IOverlayState {
    currentScene: {
        scene: string;
        countdown: number;
        music: boolean;
    },
    main: {
        darkMode: boolean;
        nextUp: {
            enabled: boolean;
            pretext: string;
            text: string;
            when: string;
        };
        slides: string[];
    };
    feature: {
        enabled: boolean;
        icon: string;
        title: string;
        text: string;
    };
    upperThird: {
        enabled: boolean;
        text: string;
    };
    lowerThird: {
        enabled: boolean;
        icon: string;
        text: string;
    };
    milestone: {
        enabled: boolean;
        text: string;
        when: string;
    };
    youtube: {
        enabled: boolean;
        queue: {
            id: string;
            lowerThird: string;
        }[];
        skipped: number;
    };
}

let socket: SocketIOClient.Socket;
let currentOverlay: IOverlayState | null = null;

function onYouTubeIframeAPIReady() {
    const url = window.location.host.includes('live.durhack.com') ? '/' : 'http://127.0.0.1:3001';
    socket = io(url, { transports: ['websocket'] });

    socket.on('connect', () => {
        const tokenSplit = window.location.search.split('?token=')[1];

        socket.emit('authenticate', tokenSplit ? tokenSplit.split('&')[0] : (localStorage.getItem('token') || ''), (err: Error) => {
            if (err) {
                alert('Failed to authenticate with live.durhack.com');
                console.error(err);
                return;
            }

            console.info('Connected.');
        });
    });

    socket.on('globalState', ({ overlay }: { overlay: IOverlayState }) => {
        if (overlay.currentScene.scene !== currentOverlay?.currentScene.scene) {
            switchScene(overlay.currentScene.scene, overlay.currentScene.countdown);
        }

        if (!isEqual(overlay.lowerThird, currentOverlay?.lowerThird)) {
            updateLowerThird(overlay.lowerThird.enabled, overlay.lowerThird.icon, overlay.lowerThird.text);
        }

        if (!isEqual(overlay.upperThird, currentOverlay?.upperThird)) {
            updateUpperThird(overlay.upperThird.enabled, overlay.upperThird.text);
        }

        if (!isEqual(overlay.main.nextUp, currentOverlay?.main.nextUp) || !isEqual(overlay.main.slides, currentOverlay?.main.slides)) {
            updateMain(overlay.main.nextUp.enabled, overlay.main.nextUp.pretext, overlay.main.nextUp.text, overlay.main.nextUp.when, overlay.main.slides);
        }

        if (!isEqual(overlay.feature, currentOverlay?.feature)) {
            updateFeature(overlay.feature.enabled, overlay.feature.icon, overlay.feature.title, overlay.feature.text);
        }

        if (!isEqual(overlay.milestone, currentOverlay?.milestone)) {
            updateMilestone(overlay.milestone.enabled, overlay.milestone.text, overlay.milestone.when);
        }

        if (overlay.main.darkMode !== currentOverlay?.main.darkMode) {
            if (overlay.main.darkMode) {
                classList('.main-wrapper').add('dark');
            } else {
                classList('.main-wrapper').remove('dark');
            }
        }

        if (!isEqual(overlay.youtube.queue, currentOverlay?.youtube.queue) || overlay.youtube.enabled !== currentOverlay?.youtube.enabled) {
            updateYouTube(overlay.youtube.enabled, overlay.youtube.queue);
        }

        if (currentOverlay && overlay.youtube.skipped !== currentOverlay.youtube.skipped) {
            skipVideo();
        }

        if (overlay.currentScene.music !== currentOverlay?.currentScene.music) {
            setAudio(overlay.currentScene.music);
        }

        currentOverlay = overlay;
    });
}

let initialSwitch = false;
let sceneSwitchInterval: number;
async function switchScene(sceneName: string, countdown: number) {
    if (!initialSwitch) {
        switchSceneTo(sceneName);
        initialSwitch = true;

        return;
    }

    if (!countdown) {
        document.querySelector('.text-pattern-bg .countdown')!.textContent = '';

        classList('.text-pattern-bg').add('animate-in-out');
        
        if (sceneName.startsWith('Recording')) {
            await waitFor(5);
            switchSceneTo(sceneName);
            await waitFor(3);
        } else {
            await waitFor(1);
            switchSceneTo(sceneName);
            await waitFor(7);
        }
        
        classList('.text-pattern-bg').remove('animate-in-out');

        return;
    }

    classList('.text-pattern-bg').add('animate-in');

    let currentCountdown = countdown;
    document.querySelector('.text-pattern-bg .countdown')!.textContent = `${currentCountdown}`;
    
    clearInterval(sceneSwitchInterval);
    sceneSwitchInterval = setInterval(async () => {
        if (currentCountdown <= 0) {
            switchSceneTo(sceneName);

            clearInterval(sceneSwitchInterval);
            
            classList('.text-pattern-bg').remove('animate-in');
            classList('.text-pattern-bg').add('animate-out');

            // for resources-sake, removing this class will kill off the animation
            await waitFor(1);
            classList('.text-pattern-bg').remove('animate-out');
        }
        
        currentCountdown--;
        document.querySelector('.text-pattern-bg .countdown')!.textContent = `${currentCountdown}`;
    }, 1000);
}

function switchSceneTo(sceneName: string) {
    console.log('now: ' + sceneName);

    if (sceneName === 'Default') {
        classList('.main-wrapper').remove('animate-out');
        classList('.main-wrapper').add('animate-in');
    } else {
        classList('.main-wrapper').remove('animate-in');
        classList('.main-wrapper').add('animate-out');
    }

    obs.send('SetCurrentScene', {
        'scene-name': sceneName,
    });
}

async function updateLowerThird(enabled: boolean, icon: string, text: string) {
    if (classList('.lower-third').contains('animate-in')) {
        classList('.lower-third').remove('animate-in');
        classList('.lower-third').add('animate-out');
        await waitFor(1.5);
    }

    if (enabled) {
        document.querySelector('.lower-third .icon span')!.className = icon;
        document.querySelector('.lower-third .text')!.textContent = text;

        classList('.lower-third').remove('animate-out');
        classList('.lower-third').add('animate-in');
    }
}

async function updateUpperThird(enabled: boolean, text: string) {
    if (classList('.upper-third').contains('animate-in')) {
        classList('.upper-third').remove('animate-in');
        classList('.upper-third').add('animate-out');
        await waitFor(1.5);
    }

    if (enabled) {
        document.querySelector('.upper-third > div')!.textContent = text;

        classList('.upper-third').remove('animate-out');
        classList('.upper-third').add('animate-in');
    }
}

async function updateFeature(enabled: boolean, icon: string, title: string, text: string) {
    if (classList('.feature').contains('animate-in')) {
        classList('.feature').remove('animate-in');
        classList('.feature').add('animate-out');
        await waitFor(2);
        classList('.feature').remove('animate-out'); // performance
    }

    if (enabled) {
        document.querySelector('.feature .icon span')!.className = icon;
        document.querySelector('.feature .text')!.textContent = title;
        document.querySelector('.feature .title')!.textContent = text;

        classList('.feature').add('animate-in');
    }
}

function getMainTextEl(text: string, className: string) {
    const result = document.createElement('div');
    result.className = className;

    const innerDivOne = document.createElement('div');
    const innerDivTwo = document.createElement('div');
    const innerDivThree = document.createElement('div');
    innerDivThree.innerHTML = text;
    innerDivTwo.appendChild(innerDivThree);
    innerDivTwo.style.animationDelay = `${mainAnimationDelay}s`;
    innerDivOne.appendChild(innerDivTwo);
    result.appendChild(innerDivOne);

    fakeCtx.font = getFontForText(text, className);
    mainAnimationDelay += 0.3;

    return result;
}

function getMainSepEl() {
    const sep = document.createElement('div');
    sep.className = 'sep-text';
    return sep;
}

let cycleIteration: number | null = null;
let cycleTimeout: number;
async function startCyclingMain() {
    console.log('Cycling: ' + cycleIteration);

    if (cycleIteration !== null) {
        const slides = document.querySelectorAll('.slides > div');
        const slide = slides[cycleIteration];
        if (slide) {
            slide.classList.remove('animate-in');
            slide.classList.add('animate-out');

            console.log('Slide max delay is', (<any>slide).dataset.maxDelay, 'so will animate out after', (Number((<any>slide).dataset.maxDelay || 1) + 1.5) * 1000);
            await new Promise(resolve => {
                cycleTimeout = setTimeout(() => {
                    resolve();
                }, (Number((<any>slide).dataset.maxDelay || 1) + 1.5) * 1000);
            });
            
            slide.classList.remove('animate-out');
        }

        cycleIteration++;
        if (cycleIteration >= slides.length) {
            cycleIteration = 0;
        }
    } else {
        cycleIteration = 0;
    }

    const slide = document.querySelectorAll('.slides > div')[cycleIteration];
    if (slide) {
        slide.classList.add('animate-in');

        // If the next up is nearly over, stay with it.
        if (slide.classList.contains('nextup') && mainNextUpWhen && Date.now() - new Date(mainNextUpWhen).getTime() > 1000 * 60 * 1.5) {
            console.log('"Next Up" is about to end. Refusing to cycle.');
            return;
        }
    }

    if (document.querySelectorAll('.slides > div').length > 1) {
        console.log('Will cycle in 15 secs...');

        cycleTimeout = setTimeout(() => {
            startCyclingMain();
        }, 15000);
    } else {
        console.log('Only one slide. Not cycling.');
    }
}

let mainAnimationDelay = 0;
let mainNextUpWhen: string | null = null;
async function updateMain(enabled: boolean, pretext: string, title: string, when: string, slides: string[]) {
    clearTimeout(cycleTimeout);

    const currentSlide = document.querySelector('.slides > div.animate-in');
    if (currentSlide) {
        currentSlide.classList.add('animate-out');
        console.log('Updating main. Slide max delay is', (<any>currentSlide).dataset.maxDelay, 'so will animate out after', Number((<any>currentSlide).dataset.maxDelay || 1) + 1);
        await waitFor(Number((<any>currentSlide).dataset.maxDelay || 1) + 1.5);
        currentSlide.classList.remove('animate-out');
        currentSlide.classList.remove('animate-in');
    }

    const slidesEl = document.querySelector('.slides')!;
    slidesEl.innerHTML = '';

    if (enabled) {
        const nextUpEl = document.createElement('div');
        nextUpEl.classList.add('nextup');

        mainAnimationDelay = 0;

        if (pretext) {
            nextUpEl.appendChild(getMainTextEl(pretext, 'minor-text'));
        }

        if (title) {
            breakUp(title, 'major-text').forEach(phrase => {
                nextUpEl.appendChild(getMainTextEl(phrase, 'major-text'));
            });
        }

        if (when) {
            nextUpEl.appendChild(getMainSepEl());

            mainNextUpWhen = when || null;

            const countdown = getNextUpCountdown(when);
            if (countdown) {
                const whenEl = getMainTextEl('Starting in ', 'minor-text');
                const whenElTime = document.createElement('span');
                whenElTime.className = 'nextup-countdown';
                whenElTime.textContent = countdown;
                whenEl.querySelector('div > div > div > div')!.appendChild(whenElTime);
                nextUpEl.appendChild(whenEl);
            }
        }

        (<any>nextUpEl).dataset.maxDelay = mainAnimationDelay;
        slidesEl.appendChild(nextUpEl);
    }

    slides.forEach(slide => {
        const lines = slide.trim().split('\n').map(line => line.trim());
        if (!lines.length) {
            return;
        }

        const slideEl = document.createElement('div');

        mainAnimationDelay = 0;
        lines.forEach(line => {
            breakUp(line, 'minor-text').forEach(phrase => {
                if (phrase) {
                    slideEl.appendChild(getMainTextEl(phrase, 'minor-text'));
                } else {
                    slideEl.appendChild(getMainSepEl());
                }
            });
        });

        (<any>slideEl).dataset.maxDelay = mainAnimationDelay;
        slidesEl.appendChild(slideEl);
    });

    cycleIteration = null;
    clearTimeout(cycleTimeout);
    startCyclingMain();
}

let milestoneWhen: string | null;
async function updateMilestone(enabled: boolean, text: string, when: string) {
    milestoneWhen = enabled ? when : null;
    
    if (classList('.milestone').contains('animate-in')) {
        classList('.milestone').remove('animate-in');
        classList('.milestone').add('animate-out');
        await waitFor(1);
        classList('.milestone').remove('animate-out');
    }

    if (enabled) {
        const countdown = getMilestoneCountdown(when);

        if (countdown) {
            document.querySelector('.milestone .text')!.textContent = text;
            document.querySelector('.milestone .countdown')!.innerHTML = countdown;

            classList('.milestone').add('animate-in');
        }
    }
}

let youtubePlayer: any;
async function updateYouTube(enabled: boolean, queue: { id: string; lowerThird: string }[]) {
    if (!enabled) {
        classList('.youtube').remove('animate-in');

        if (youtubePlayer) {
            youtubePlayer.destroy();
            youtubePlayer = null;
        }

        document.querySelector('.youtube')!.innerHTML = '<div id="yt-player"></div>';
        return;
    }

    function onPlayerReady(event: any) {
        console.info('YouTube ready.');
        classList('.youtube').add('animate-in');
        event.target.loadPlaylist(queue.map(({ id }) => id));
    }
   
    let justStarting = false;
    let timeout: number;
    function onPlayerStateChange({ data }: { data: number }) {
        console.info(`YouTube state is now ${data}`);
        if (justStarting && data === 1) { // playing
            justStarting = false;
            clearTimeout(timeout);
            const currentId = youtubePlayer.getVideoUrl().split('?v=')[1].split('&')[0];
            const queued = queue.find(({ id }) => id === currentId);
            if (queued) {
                updateLowerThird(true, 'fas fa-film', queued.lowerThird);

                timeout = setTimeout(() => {
                    updateLowerThird(false, '', '');
                    clearTimeout(timeout);
                }, 16000);
            }
        }
        
        if (data === -1) { // unstarted
            justStarting = true;
        }
    }

    youtubePlayer = new (window as any).YT.Player('yt-player', {
        height: '720',
        width: '1280',
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        },
        playerVars: {
            controls: 0
        },
    });
}

function skipVideo() {
    if (youtubePlayer) {
        youtubePlayer.nextVideo();
    }
}

function classList(selector: string) {
    return document.querySelector(selector)!.classList;
}

async function waitFor(seconds: number) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, seconds * 1000);
    });
}

const fakeCtx = document.createElement('canvas').getContext('2d')!;
function breakUp(text: string, kind: string) {
    const limit = 980;
    const result: string[] = [];
    fakeCtx.font = getFontForText(text, kind);

    let phrase = '';
    text.split(' ').forEach(word => {
        let nextPhrase = `${phrase} ${word}`;
        if (fakeCtx.measureText(`${phrase} ${word}`).width > limit) {
            result.push(phrase.trim());
            phrase = '';
        } else {
            phrase = nextPhrase;
        }
    });

    if (phrase.length) {
        result.push(phrase.trim());
    }

    return result;
}

function getNextUpCountdown(when: string) {
    const destTime = new Date(when).getTime();

    if (isNaN(destTime)) {
        return null;
    }

    const diffSeconds = Math.max(0, Math.floor(destTime / 1000) - Math.floor(Date.now() / 1000));
    const minutes = Math.floor(diffSeconds / 60);

    // if (minutes > 90) {
    //     return null;
    // }

    return `${minutes}:${zeroPad(diffSeconds - (minutes * 60))}`;
}

function getMilestoneCountdown(when: string) {
    const destTime = new Date(when).getTime();

    if (isNaN(destTime)) {
        return null;
    }

    const diffSeconds = Math.max(0, Math.floor(destTime / 1000) - Math.floor(Date.now() / 1000));
    const hours = Math.floor(diffSeconds / 3600);
    const minutes = Math.floor((diffSeconds - (hours * 3600)) / 60);
    const seconds = diffSeconds - (hours * 3600) - (minutes * 60);

    let result = '';
    const str = `${zeroPad(hours)}:${zeroPad(minutes)}:${zeroPad(seconds)}`;
    for (let char of str) {
        if (char === ':') {
            result += '<span class="sep">:</span>';
        } else {
            result += `<span>${char}</span>`;
        }
    }

    return result;
}

let audioPromise = Promise.resolve();
function setAudio(enabled: boolean) {
    audioPromise.then(() => {
        audioPromise = setAudioNow(!enabled);
    });
}

async function setAudioNow(muted: boolean) {
    // What's the volume now?
    const current: { volume: number; muted: boolean } = await obs.send('GetVolume', { source: 'Desktop Audio' });
    console.info(`Volume is ${current.volume} and want muted to be ${muted}, currently ${current.muted}.`);

    // If we're already muted... cool! Nothing to do.
    if (current.muted === muted) {
        return;
    }

    // If we want to mute
    if (muted) {
        // Slowly drag the volume down.
        let currentVolume = current.volume;
        await new Promise(resolve => {
            let interval = setInterval(() => {
                currentVolume -= 0.05;
                if (currentVolume <= 0) {
                    clearInterval(interval);
                    resolve();
                } else {
                    console.info(`Set volume to ${currentVolume}...`);
                    obs.send('SetVolume', { source: 'Desktop Audio', volume: currentVolume }).catch((err: Error) => {
                        console.error(err);
                    });
                }
            }, 50);
        });

        // Now mute it altogether.
        await obs.send('SetMute', { source: 'Desktop Audio', mute: true });

        // And set the volume back to whatever it was before.
        await obs.send('SetVolume', { source: 'Desktop Audio', volume: current.volume });

        return;
    }

    // If we want to unmute, set volume to zero and unmute.
    await obs.send('SetVolume', { source: 'Desktop Audio', volume: 0 });
    await obs.send('SetMute', { source: 'Desktop Audio', mute: false });

    // Slowly drag the volume up
    let currentVolume = 0;
    await new Promise(resolve => {
        let interval = setInterval(() => {
            currentVolume += 0.05;
            if (currentVolume >= current.volume) {
                currentVolume = current.volume;
            }
            console.info(`Set volume to ${currentVolume}...`);
            obs.send('SetVolume', { source: 'Desktop Audio', volume: currentVolume }).catch((err: Error) => {
                console.error(err);
            });
            if (currentVolume >= current.volume) {
                clearInterval(interval);
                resolve();
            }
        }, 500);
    });
}

function zeroPad(num: number) {
    if (num < 10) {
        return `0${num}`;
    }

    return num;
}

function getFontForText(text: string, kind: string) {
    if (kind === 'major-text') {
        return '900 72px "Exo 2"';
    }

    return '600 34px "Exo 2"';
}

setInterval(() => {
    // "Next up" tick
    const nextUpCountdown = document.querySelector('.nextup-countdown');
    if (mainNextUpWhen && nextUpCountdown) {
        nextUpCountdown.textContent = getNextUpCountdown(mainNextUpWhen);
    }

    // "Milestone" tick
    const milestoneCountdown = document.querySelector('.milestone .countdown');
    if (milestoneWhen && milestoneCountdown) {
        milestoneCountdown.innerHTML = getMilestoneCountdown(milestoneWhen) || '';
    }
}, 1000);

//const testDate = new Date(Date.now() + (1000 * 60 * 2));
//updateMain(true, 'Next up', 'I am something super super super long', testDate.toISOString(), ['Hello!']);
//updateMilestone(true, 'Hacking will end in', testDate.toISOString());
