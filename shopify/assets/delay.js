(function (window) {
  const autoLoadDuration = 5; //In Seconds
  const eventList = ["keydown", "mousemove", "wheel", "touchmove", "touchstart", "touchend"];
  const autoLoadTimeout = setTimeout(runScripts, autoLoadDuration * 1000);
  const scriptsLoaded = []

  function toCamelCase(str) {
    let newStr = "";
    if (str) {
      let wordArr = str.split(/[-_]/g);
      for (let i in wordArr) {
        newStr += i > 0
          ? wordArr[i].charAt(0).toUpperCase() + wordArr[i].slice(1)
          : wordArr[i]
      }
    } else {
      return newStr
    }
    return newStr;
  }

  eventList.forEach(function (event) {
    window.addEventListener(event, triggerScripts, { passive: true })
  });

  function triggerScripts() {
    runScripts();
    clearTimeout(autoLoadTimeout);
    eventList.forEach(function (event) {
      window.removeEventListener(event, triggerScripts, { passive: true });
    });
  }

  const async = (src, callback, dataset) => {
    if (scriptsLoaded.includes(src)) return

    const tag = 'script';
    const createdElement = document.createElement(tag);
    const nestedTag = document.getElementsByTagName(tag)[0];

    createdElement.src = src;

    if (callback) {
      if (Object.keys(dataset).length > 0) {
        setDataSet(dataset)
      } 
      createdElement.addEventListener('load', (e) => {
        callback(null);
        scriptsLoaded.push(src)
      }, false);
    }

    nestedTag.parentNode.insertBefore(createdElement, nestedTag);
  }

  function setDataSet(dataset) {
    if (!dataset.name) return
    const globalName = toCamelCase(dataset.name)
    window[globalName] = dataset
  }

  function getAwaitScriptTag(id) {
    const tag = document.getElementById(id)
    if (!tag) return
    const src = tag.getAttribute("await")
    getDelayTime(tag, src)
  }

  function getDelayTime(tag, src) {
    const delayedTimeAttribute = tag.getAttribute("delayed-time") || 0
    const delayedTime = parseInt(delayedTimeAttribute)
    const dataset = tag.dataset

    setTimeout(() => {
      async(src, () => getRunAfterLoadAttribute(tag), dataset)
    }, delayedTime)
  }

  function getRunAfterLoadAttribute(scriptTag, dataset) {
    const newScriptId = scriptTag.getAttribute("run-after-load")
    if (!newScriptId) return

    const scriptsToLoad = newScriptId.split(',')
    scriptsToLoad.forEach(singleScript => {
      getAwaitScriptTag(singleScript)
    });
  }

  const getTriggerEls = () => Array.from(document.querySelectorAll('[script-trigger]')).filter(el => !el.getAttribute('script-loaded'));

  const getEventDelayedScriptTags = () => Array.from(document.querySelectorAll('script[event-delay]'));

  const filterMatchingScriptTags = (scriptTags, element) => scriptTags.filter(scriptTag => scriptTag.getAttribute('event-listener') == element.getAttribute('trigger-event'))

  const setEventDelayedScriptTags = (element, scriptTags) => {
    const matchingScriptTags = filterMatchingScriptTags(scriptTags, element);
    if(!!matchingScriptTags){
      matchingScriptTags.forEach(tag => {
        src = tag.getAttribute('event-delay')
        getDelayTime(tag, src)
        tag.setAttribute('script-loaded', true)
      })
    }
  } 

  const openChatOnInitialClick = () => {
    const button = document.getElementById('chat-button')
    if(button){
      setTimeout(() => {
        document.getElementById('chat-button').contentWindow.document.querySelector("button").click();
        
        return
      }, 100)

    } else {
      setTimeout(() => openChatOnInitialClick(), 100);
    }
  }

  const addElementEventListeners = (element, scriptTags) => {
    const events = element.getAttribute('events').split(',');
    
    if(events.length > 0){
      events.forEach(event => {
        element.addEventListener(event, (e) => {
          if(element.dataset.chatIcon){

            setTimeout(() => e.target.closest("button").style.display = "none", 300)
            openChatOnInitialClick();
          }

          setEventDelayedScriptTags(element, scriptTags)
        }, { once: true });

      })
    }
  }

  const runEventDelayedScripts = () => {
    const triggerEls = getTriggerEls();
    const scriptTags = getEventDelayedScriptTags();
    triggerEls.forEach(element => addElementEventListeners(element, scriptTags));
  }

  function runScripts() {
    runEventDelayedScripts();

    document.querySelectorAll("script[delay]").forEach(function (scriptTag) {
      const src = scriptTag.getAttribute("delay")
      getDelayTime(scriptTag, src)
    })
  }
  
})(this);
