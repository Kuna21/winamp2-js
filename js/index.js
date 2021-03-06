import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';

import getStore from './store';
import WindowManager from './components/WindowManager';
import Browser from './browser';
import MainWindow from './components/MainWindow';
import PlaylistWindow from './components/PlaylistWindow';
import EqualizerWindow from './components/EqualizerWindow';
import Winamp from './winamp';
import Hotkeys from './hotkeys';
import Skin from './components/Skin';

if (new Browser(window).isCompatible) {
  const hash = window.location.hash;
  // Turn on the incomplete playlist window
  const playlist = hash.includes('playlist');
  // Turn on the incomplete equalizer window
  const equalizer = hash.includes('equalizer');
  const winamp = Winamp;

  const store = getStore(winamp);

  render(
    <Provider store={store}>
      <div>
        <Skin>
          {/* This is not technically kosher, since <style> tags should be in
          the <head>, but browsers don't really care... */}
        </Skin>
        <WindowManager>
          <MainWindow fileInput={winamp.fileInput} mediaPlayer={winamp.media} />
          { playlist ? <PlaylistWindow /> : '' }
          { equalizer ? <EqualizerWindow /> : '' }
        </WindowManager>
      </div>
    </Provider>,
    document.getElementById('winamp2-js')
  );

  winamp.dispatch = store.dispatch;

  const cdnUrl = 'https://cdn.rawgit.com/captbaritone/winamp2-js/master/';
  const assetBase = process.env.NODE_ENV === 'production' ? cdnUrl : '';
  winamp.init({
    volume: 50,
    balance: 0,
    mediaFile: {
      url: `${assetBase}mp3/llama-2.91.mp3`,
      name: "1. DJ Mike Llama - Llama Whippin' Intro"
    },
    skinUrl: `${assetBase}skins/base-2.91.wsz`
  });

  new Hotkeys(winamp, store);
} else {
  document.getElementById('winamp').style.display = 'none';
  document.getElementById('browser-compatibility').style.display = 'block';
}
