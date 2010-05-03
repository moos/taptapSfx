/**
 * taptapSfx.js
 * 
 * adding old-style typewriter soundFx to any web page via HTML5 audio tag
 * 
 * (c) 2010 http://42at.com/lab/taptapSfx
 * 
 */
;(function(){
	
	var thisScript = "taptapSfx.js",
		path = getScriptPath(thisScript),
		audio = {},
		options = {},
		mute = false,
		keyClip = 0,
		nkeyClips,
		backgrounds = [],
		volumes = [1,.3,0],
		bgIndex = 0,
		volIndex = 0,
		volumeKey = null,
		moz = /firefox/i.test(navigator.userAgent),
		ext = moz ? 'ogg' : 'mp3';
	
	__init();
	enableKeyboardFx(true);

	
	var nplay = 3;
	var intro = setInterval(function(){
		if (nplay--) playAudio();
		else clearInterval(intro);
	}, 250);
	
	
	function __init(){
		// preload audio
		audio = {
				'enter': [makeAudio(path + "typing-return."+ext)],
				'space': [makeAudio(path + "typing-space."+ext)]
			};

			// multiple key audio for desktop browsers
			if (window.Touch){
				audio['_key'] = [makeAudio(path + "typing."+ext)];
			} else {
				audio['_key'] = [  
					  makeAudio(path + "typing."+ext)
			          ,makeAudio(path + "typing."+ext)
			          ,makeAudio(path + "typing."+ext)
			          ,makeAudio(path + "typing."+ext)
			          ,makeAudio(path + "typing."+ext)
			          ,makeAudio(path + "typing."+ext)
		         ];
			}
		// rotate through audio channels for regular keys
		nkeyClips = audio['_key'].length;
		
		/* normal */ backgrounds[0] = 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAH0SURBVDjLxdPPS9tgGAfwgH/ATmPD0w5jMFa3IXOMFImsOKnbmCUTacW1WZM2Mf1ho6OBrohkIdJfWm9aLKhM6GF4Lz3No/+AMC/PYQXBXL1+95oxh1jGhsgOX/LywvN5n/fN+3IAuKuEuzagVFoO27b1/Z+BcrnUx4otx7FPLWsJvYpIM2SS9H4PqNWqfK1W8VKplHlW/G1zs4G9vS9YXPx4CaDkXOFES4Om4gceUK2WsbZWR72+gtXVFezsbKHVamF7ewtm/sMFgBJZhd6pvm4kDndaAo2KOmt5Gfv7X9HpdNBut9FsNmFZFgPrMHKZc4DkjHyi6KC3MZNehTOuGAH5Xx5ybK/Y3f0Mx3Fg2zaKxSIMw2DjT0inNQ84nogcUUQJHIfZquNT3hzx46DBALizg2o01qEoCqLRKERRRDAYhKYlWRK/AJdCMwH2BY28+Qk8fg667wdXKJjY2FiHaeaRzWYQCk1AEASGzSCZjP/ewtik5r6eBD0dM+nRSMb1j4LuPDnkFhZymJ/PsmLdazmV0jxEkqKsK+niIQ69mKUBwdd9OAx3SADdHtC53FyK12dVXlVlPpF4zytK7OgMyucNyHLs8m+8+2zJHRwG3fId9LxIbNU+OR6zWU57AR5y84FKN+71//EqM2iapfv/HtPf5gcdtKR8VW88PgAAAABJRU5ErkJggg==") center center no-repeat';
		/* low    */ backgrounds[1] = 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAGeSURBVDjLxdO9SwJhHAdwIdpqrKmxNZqKuEUhSIyixCI0yjPv1PM1z8KDEonrOPF8OzcVhYoCh2gXp/wzcnmGgiDX1m+PQsZR9EJEw5fnWX6f5/e8mQCYfhPTnwHZbMapKPL9jwFNy47QYllVlWdZPsGXQKGQZwqF3CC5nMbQ4rt6vYabm2uk08fvAOLfHzcA+byGclmHrhdRKhVxcXGGZrOJ8/MzSMlDA0B8MZ7sBqYMgKZl0Oncot1uo9VqodFoQJZlCuoQ49EhQLgo98SHQDZYiaw4J4YA3Suuri6hqioURUEqlYIoinR+ikhEGACP664ucfGLj04PyPKWoStT/6BqtQp4nofb7YbD4YDNZoMg+Gl8r0CP2HcW6QhiWTMCR0cSqtUKJCmJWCwKu30dZrOZYjvw+71vW7BuCr3VTZB5q0hmLWND4OAgjkQiRotDg5bDYWGAeDxu2pXHeIhzS0EyY540dBDfDzOhYIAJBDjG59tjeJ7t9qFkUgTHse+vcXph9NOHRFcd4bysQvP8EfDtp0yhbZqH//tM380L5ZG0STFOrDMAAAAASUVORK5CYII=") center center no-repeat';
		/* mute   */ backgrounds[2] = 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAFsSURBVDjLxZO/SwJhHMYF16b+gP6GZiehwcm7hBORKLXzPT1SIhMUHCKO48TT88emhwchHTiEERQhTrlE1FIhQS1BGRTU5vr0ntgS6BFBDR94eeH5fPk+L68DgOM3OP5MUCjkg7IsPf9YoKoFJw1LiiKPJGkX7wyToCxMFWhayaVpxTHFouqi4ftmU0enc4CTGLEE15T5qYJSSUWtVkW1WkalUkartYd2u43zbBZPPp8lMGeuoKp59Ptn6PV66Ha7MAwDp6KIIcfh1u+3BHMzBXRXmOY+FEWBLMs4FoTx5LtgENuJOGxLtIrS9ToIITADATwyDC69XmzGBYiiYC/I5bJoNOo44vnx5CuWgcftRii0iliMtxek01s4jIRoeBk3dO/URhw+eo7QO0Ii9oIBx+lvLPvxwrKDnfW1JULCD8mkiEwmhWg0PFtAG16kvFIuvtqmU51RPixTRraCicTz/akmohXK8P8+0zQ+AXBHwZp9sfnqAAAAAElFTkSuQmCC") center center no-repeat';

		// add volume bottom
		var el = document.createElement('div');
		with (el.style) {
			position = "fixed";
			width = "28px";
			height = "28px";
			background = backgrounds[0];
			borderRadius = "12px";
			boxShadow = "1px 1px 2px #333";
			border = "1px solid rgba(128,128,128,.5)";
			opacity = ".3";
			top = "42px";
			right = "2px";
		}
		el.title = "taptapSfx volume";
		el.style['-moz-border-radius'] = '8px';
		el.style['-webkit-box-shadow'] =  '1px 1px 3px';
		
		volumeKey = document.getElementsByTagName('body')[0].appendChild(el);
		volumeKey.addEventListener('contextmenu', function(ev){
			alert('Typing sound fx\n(c) 2010 http://42at.com/lab/taptapSfx');
		},false);
		volumeKey.addEventListener('click', function(ev){
			bgIndex = ++bgIndex % backgrounds.length;
			volIndex = ++volIndex % volumes.length;
			volumeKey.style.background = backgrounds[bgIndex];
			adjustVolumes(volumes[volIndex]);
			mute = volumes[volIndex] == 0;
		}, false);
	}
	
	function playAudio(key){
		var clip = (key in audio) ? audio[key][0] : audio['_key'][++keyClip % nkeyClips];
		clip.pause();
		clip.play();
	};
	
	function adjustVolumes(level){
		for (var k in audio)
			audio[k].forEach(function(item){item.volume = level;})
	};
	
	
	// enable fx for browser keyboard
	function enableKeyboardFx (enable){
		var body = document.getElementsByTagName('body')[0];
		if (enable || typeof enable == 'undefined') {
			body.addEventListener('keypress', onKeyboardPress,true);
			options.keyboardFx = true;
		} else {
			body.removeEventListener('keypress', onKeyboardPress,true);
			options.keyboardFx = false;
		}
	};	

	
	function onKeyboardPress(ev){
		var code = ev.keyCode || ev.charCode,
			key = code == 13 || code == 10 ? 'enter' :
				  code == 32 ? 'space' : '';
		// play audio
		!mute && playAudio(key);
		return true;
	}	
		

	function makeAudio(src){
		var el = document.createElement('audio');
		el.src = src;
		el.autoplay = false;
		el.controls = false; 
		el.autobuffer = true;
		el = document.getElementsByTagName('body')[0].appendChild(el);
		el.load();
		return el;
	}

	
	function getScriptPath(scriptName){
		var index, path, script, 
			scripts = document.querySelectorAll('script');

		// find our script
		for (var i=0; i<scripts.length; i++){
			script = scripts[i];
			index = script.src.indexOf(scriptName);
			if (index != -1) break;
		}
		if (index == -1) throw "hmmm... was "+scriptName+" renamed?";
		
		// is there a path arg in the query string?
		match = script.src.match(/path=([^&]*)/);
		path = (match && match[1]);
		if (path)
			path = path.replace(scriptName,'');
		else
			path = script.src.substring(0,index);

		return path; 
	}

	
})();