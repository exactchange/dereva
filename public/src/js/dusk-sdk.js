const DuskSDK = window.DuskSDK = {
  package: {
    name: 'dusk-sdk',
    version: '0.0.8'
  },
  Tabs: ({
    rootElement,
    rootPath,
    onRender,
    onLoad,
    orgTab,
    appTab,
    appTab: {
      devStatus
    }
  }) => {
    const element = document.createElement('div');

    element.innerHTML = `
      <button id="tab-button">☰</button>
      <ul id="tabs">
        ${!orgTab ? '' : `
          <li>
            <span class="icon"></span>
            <a href="/">${orgTab.name}</a>
          </li>
        `}
        <li>
          <span class="icon"></span>
          <a href="${rootPath}">
            ${appTab.name}
            ${!devStatus ? '' : `
              <span class="app-label ${devStatus}">${devStatus}</span>
            `}
          </a>
        </li>
      </ul>
    `;

    Array.from(element.children).reverse().forEach(child => (
      rootElement.insertBefore(child,rootElement.firstElementChild)
    ));

    const onOpen = () => {
      const tabs = document.getElementById('tabs');
      const tabButton = document.getElementById('tab-button');

      tabButton.setAttribute('class', 'open');
      tabs.setAttribute('class', 'open');
      tabButton.onclick = onClose;
      tabButton.innerHTML = '';

      setTimeout(() => (
        tabButton.innerHTML = '✕'
      ), 300);
    };

    const onClose = () => {
      const tabs = document.getElementById('tabs');
      const tabButton = document.getElementById('tab-button');

      tabButton.removeAttribute('class');
      tabs.removeAttribute('class');
      tabButton.onclick = onOpen;
      tabButton.innerHTML = '';

      setTimeout(() => {
        const tabButton = document.getElementById('tab-button');

        tabButton.innerHTML = '☰';
      }, 300);
    };

    const tabButton = document.getElementById('tab-button');

    tabButton.onclick = onOpen;
    requestAnimationFrame(onLoad);

    return {
      onOpen,
      onClose,
      onRender,
      onLoad
    };
  },
  Responsive: ({ frame } = { frame: null }) => {
    const onResize = () => {
      const isFocused = Boolean(
        document.querySelectorAll('input:focus').length
      );

      setTimeout(() => {
        if (frame) {
          frame.setAttribute('style', `max-height: ${window.innerHeight}px`);
        }

        if (!isFocused) {
          window.scrollTo(0, 0);
        }
      }, 500);
    };

    const isMobile = (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    );

    if (isMobile) {
      document.addEventListener('touchmove', event => {
        if (event.scale !== 1) {
          event.preventDefault();
        }
      }, { passive: false });

      window.onresize = onResize;
    }

    return {
      isMobile,
      onResize
    };
  }
};
