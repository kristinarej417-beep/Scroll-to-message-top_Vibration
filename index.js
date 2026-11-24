import { eventSource, event_types } from '../../../../script.js';

eventSource.on(event_types.CHARACTER_MESSAGE_RENDERED, (id) => {
  setTimeout(() => {
    const chat = document.getElementById('chat');
    const mes = chat?.querySelector(`.mes[mesid="${id}"]`);
    if (!mes) return;
    chat.scrollTo({
      top: mes.offsetTop - chat.offsetTop,
      behavior: 'smooth',
    });
  }, 100);
});
