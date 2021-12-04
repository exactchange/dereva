const DuskSDK = window.DuskSDK = {
  package: {
    name: 'dusk-sdk',
    version: '0.2.0'
  },
  Browser: () => {
    // Render stylesheet

    const css = document.createElement('style');

    css.setAttribute('type', 'text/css');

    css.appendChild(
      document.createTextNode(`
        @keyframes hide {
          from {
            opacity: 1;
            top: 10px;
          }
          to {
            opacity: 0;
            top: -100px;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes shakeLeftRight {
          0% {
            transform: translate3d(-10px, 0, 0);
          }
          10% {
            transform: translate3d(20px, 0, 0);
          }
          20% {
            transform: translate3d(-20px, 0, 0);
          }
          30% {
            transform: translate3d(10px, 0, 0);
          }
          40% {
            transform: translate3d(-10px, 0, 0);
          }
          100% {
            transform: translate3d(0, 0, 0);
          }
        }

        ::selection {
          background: transparent;
        }

        * {
          box-sizing: border-box;
        }

        html, body {
          background: #19181b;
        }

        body {
          display: flex;
          flex-direction: column;
          margin: 0;
          min-width: 100vw;
          min-height: 100vh;
          font: 400 normal 18px "Raleway", sans-serif;
          color: rgb(10, 20, 25);
          overflow: hidden;

        }

        p, a, h1, h2, h3, h4, h5, h6, button {
          -webkit-font-smoothing: antialiased;
        }

        h1 {
          color: white;
          text-align: center;
          font-size: 2.4em;
        }

        a {
          color: #00d8ff;
          text-decoration: none;
          font-size:  14px;
        }

        a,
        button {
          cursor: pointer;
          outline: none;
          transition: color .5s ease;
        }

        a:hover {
          text-decoration: underline;
        }

        p.left {
          text-align: left;
        }

        p.right {
          text-align: right;
        }

        p.center {
          text-align: center;
        }

        .full {
          width: 100%;
          height: 100%;
        }

        .full-vh {
          min-height: 100vh;
          max-height: 100vh;
        }

        .flex {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .flex.column {
          flex-direction: column;
        }

        .flex.end {
          align-items: flex-end;
          justify-content: flex-end;
        }

        .flex.start {
          align-items: flex-start;
          justify-content: flex-start;
        }

        .flex.around {
          align-items: center;
          justify-content: space-around;
        }

        .flex.between {
          align-items: center;
          justify-content: space-between;
        }

        .flex > * {
          flex: 1;
        }

        .scroll-y {
          overflow-y: auto;
        }

        .hr {
          display: block;
          border-bottom: 1px solid rgba(255, 255, 255, .1);
          margin: .5rem 0;
        }

        #main {
          display: flex;
          flex: 1;
          width: 100%;
          overflow-x: hidden;
        }

        #main > * {
          padding: 25px;
        }

        #notification {
          position: fixed;
          color: white;
          background: black;
          box-sizing: border-box;
          opacity: 0;
          top: -100px;
          left: 230px;
          right: 10px;
          border-radius: 14px;
          padding: 0 14px;
          width: calc(100% - 240px);
          height: 50px;
          line-height: 50px;
          font-size: 1em;
          text-shadow: 0 1px 0 rgba(0, 0, 0, 0.8);
          z-index: 1000;
          transition: top .5s ease, opacity .5s ease;
        }

        #notification.show {
          top: 10px;
          opacity: 1;
          animation: hide .5s 4s forwards;
        }

        #notification.error {
          background: #f44336;
        }

        #content {
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: center;
          width: 100%;
          max-width: calc(100% - 220px);
          height: 5rem;
          padding: 1rem;
          align-self: center;
        }

        #content > h1 {
          flex: 1;
          display: block;
          color: transparent;
          min-height: 100%;
          min-width: 100%;
          margin: 0;
          font-size: 2.9em;
          line-height: .8em;
        }

        #content > input {
          background: #111;
          font: 400 normal 14px "Raleway", sans-serif;
          width: 400px;
          max-width: 90%;
          height: 28px;
          border-radius: 15px;
          border: none;
          padding: 1.5rem 1rem;
          color: white;
          align-self: center;
          outline: none;
        }

        #apps {
          list-style: none;
          display: grid;
          grid-template-columns: repeat(4, 4rem);
          grid-gap: 0 1.5rem;
          min-height: 15rem;
          max-height: 15rem;
          margin: 2rem 0 0;
          padding: 0;
        }

        #apps > li {
          display: flex;
          justify-content: center;
          background: black;
          border-radius: 1rem;
          border: 1px solid black;
          box-shadow: 0 2px 0 black, inset 0 25px rgb(255 255 255 / 15%), 0 0 2rem black;
          width: 4rem;
          height: 4rem;
        }

        #apps > li > a,
        #apps > li > a:hover {
          display: block;
          width: 100%;
          height: 100%;
          text-decoration: none;
        }

        #apps > li > a > p {
          flex: 1;
          margin-top: 5rem;
          color: white;
          font-weight: 600;
          font-size: .8em;
          text-align: center;
          text-transform: capitalize;
        }

        #nav {
          display: flex;
          list-style: none;
          margin: 0 0 20px;
          padding: 10px 0;
          justify-content: space-around;
          border-top: 1px solid black;
          border-bottom: 1px solid black;
          font-weight: 800;
        }

        #nav > li > a {
          display: block;
          color: black;
          text-transform: capitalize;
        }

        #main {
          display: flex;
          height: 100%;
        }

        #tabs {
          position: fixed;
          width: 220px;
          height: 100vh;
          background: #111;
          list-style: none;
          margin: 0;
          padding: 0;
          font: 800 normal 1em "Raleway", sans-serif;
          transition: transform .5s ease;
          z-index: 900;
        }

        #tabs + * {
          margin-left: 220px;
        }

        #tabs > li {
          margin: 1px 0;
          padding: 0 0 0 1rem;
          display: flex;
          align-items: center;
          justify-content: start;
          height: 4rem;
        }

        #tabs > li.category {
          color: #666;
          font-size: .5em;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 2px;
          height: 2rem;
        }

        #tabs > li.active {
          border-left: solid 2px #00d8ff;
        }

        #tabs > li:first-of-type {
          background: transparent;
          opacity: .75;
        }

        #tabs > li:first-of-type:hover {
          background: transparent;
          opacity: 1;
        }

        #tabs > li > .icon {
          display: block;
          min-width: 24px;
          min-height: 24px;
          border-radius: .5rem;
          background-size: contain;
          background-position: center center;
          background-repeat: no-repeat;
        }

        #tabs > li:first-of-type > .icon {
          filter: saturate(0);
        }

        #tabs > li:first-of-type:hover > .icon {
          filter: saturate(1);
        }

        #tabs > li > a {
          display: flex;
          align-items: center;
          color: white;
          text-overflow: ellipsis;
          text-decoration: none;
          white-space: nowrap;
          overflow: hidden;
          width: 100%;
          height: 100%;
          line-height: 4rem;
          margin-left: 8px;
          font-weight: 600;
        }

        #tabs > li:not(:first-of-type) > a {
          text-transform: capitalize;
        }

        #tabs > li:first-of-type > a,
        #tabs > li:nth-of-type(2) > a {
          font-weight: 600;
        }

        #tabs > li > a > span.app-label {
          flex: 1;
          display: block;
          background: white;
          color: black;
          border-radius: 100vw;
          max-width: 2rem;
          margin-left: .3rem;
          padding: .25rem;
          line-height: 5px;
          font-size: .6em;
          text-align: center;
          text-transform: capitalize;
        }

        #tabs > li > a > span.app-label.dev {
          background: #dda02f;
        }

        #tabs > li > a > span.app-label.alpha {
          background: #5c4d94;
        }

        #tabs > li > a > span.app-label.beta {
          background: #da4052;
        }

        #tab-button {
          display: none;
          position: fixed;
          width: 3rem;
          height: 3rem;
          margin: 0.5rem;
          background: black;
          color: white;
          appearance: none;
          border: none;
          box-shadow: 0 0 1rem black;
          transition: left .5s ease;
          -webkit-tap-highlight-color: transparent;
          z-index: 950;
        }

        #tab-button.open {
          background: transparent;
          box-shadow: none;
          left: 155px;
          opacity: .5;
        }

        @media (max-width: 900px) {
          #tabs {
            transform: translate3d(-220px, 0, 0);
          }

          #tabs.open {
            transform: translate3d(0, 0, 0);
          }

          #tab-button {
            display: block;
          }

          #tabs + * {
            margin-left: auto;
            width: 100%;
          }

          #main > * {
            padding: 0;
          }

          #content {
            max-width: 100%;
            padding: 1rem;
          }

          #notification {
            width: calc(100% - 20px);
            left: 10px;
          }
        }
      `)
    );

    document.head.insertBefore(css, document.head.children[1]);
  },
  Tabs: ({
    rootElement,
    rootPath,
    onRender,
    onLoad,
    orgTab,
    appTab: {
      name,
      devStatus,
      iconPath
    }
  }) => {
    document.getElementById('tabs').remove();

    const element = document.createElement('div');

    element.innerHTML = `
      <button id="tab-button">☰</button>
      <ul id="tabs">
        ${!orgTab ? '' : `
          <li>
            <span class="icon" style="background-image: url(${orgTab.iconPath});"></span>
            <a href="/">${orgTab.name}</a>
          </li>
        `}
        <li>
        <span class="icon" style="background-image: url(${iconPath});"></span>
          <a href="${rootPath}">
            ${name}
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
