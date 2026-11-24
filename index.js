import { eventSource, event_types, saveSettingsDebounced } from '../../../../script.js';
import { extension_settings } from '../../../extensions.js';

const KEY = 'scroll_to_top';
const defaults = { scroll: true, offset: 0, vibrate: true, duration: 300 };

function getSettings() {
  extension_settings[KEY] ??= {};
  for (const [k, v] of Object.entries(defaults)) {
    extension_settings[KEY][k] ??= v;
  }
  return extension_settings[KEY];
}

eventSource.on(event_types.CHARACTER_MESSAGE_RENDERED, (id) => {
  const s = getSettings();

  if (s.vibrate) navigator.vibrate?.(s.duration);

  if (s.scroll) {
    setTimeout(() => {
      const chat = document.getElementById('chat');
      const mes = chat?.querySelector(`.mes[mesid="${id}"]`);
      if (!mes) return;
      chat.scrollTo({
        top: mes.offsetTop - chat.offsetTop - s.offset,
        behavior: 'smooth',
      });
    }, 100);
  }
});

jQuery(() => {
  const s = getSettings();

  $('#extensions_settings2').append(`
    <div class="inline-drawer">
      <div class="inline-drawer-toggle inline-drawer-header">
        <b>Scroll to message top</b>
        <div class="inline-drawer-icon fa-solid fa-circle-chevron-down down"></div>
      </div>
      <div class="inline-drawer-content">
        <label class="checkbox_label">
          <input type="checkbox" id="stt_scroll">
          <span>Прокрутка к началу сообщения</span>
        </label>
        <label>Отступ сверху (px)
          <input type="number" id="stt_offset" class="text_pole" min="-500" max="500">
        </label>
        <label class="checkbox_label">
          <input type="checkbox" id="stt_vibrate">
          <span>Вибрация при новом сообщении</span>
        </label>
        <label>Длительность вибрации (мс)
          <input type="number" id="stt_duration" class="text_pole" min="50" max="2000" step="50">
        </label>
        <div id="stt_test" class="menu_button">Проверить вибрацию</div>
      </div>
    </div>
  `);

  $('#stt_scroll').prop('checked', s.scroll).on('change', function () {
    s.scroll = this.checked; saveSettingsDebounced();
  });
  $('#stt_vibrate').prop('checked', s.vibrate).on('change', function () {
    s.vibrate = this.checked; saveSettingsDebounced();
  });
  $('#stt_offset').val(s.offset).on('input', function () {
    s.offset = Number(this.value) || 0; saveSettingsDebounced();
  });
  $('#stt_duration').val(s.duration).on('input', function () {
    s.duration = Number(this.value) || 300; saveSettingsDebounced();
  });
  $('#stt_test').on('click', () => navigator.vibrate?.(s.duration));
});
