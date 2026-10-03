import { playTransformationAnimation } from './animation';
import { MutationHandler } from './mutation-handler';
import { getContentSettings, isContentSiteEnabled, watchContentSettings } from './runtime';
import { applySiteIdentity } from './site-adapter';
import { applyTheme, removeTheme } from './theme-manager';
import { Transformer } from './transformer';

async function boot(): Promise<void> {
  let settings = await getContentSettings();
  let transformer: Transformer | undefined;
  let observerStarted = false;
  const transform = () => transformer?.transform(document.body ?? document.documentElement);
  const activate = (next: typeof settings) => {
    settings = next;
    applyTheme(next);
    applySiteIdentity(document.documentElement);
    if (!transformer) transformer = new Transformer();
    if (!observerStarted) {
      new MutationHandler(transformer).start();
      observerStarted = true;
    }
    if (document.body) transform();
    else document.addEventListener('DOMContentLoaded', transform, { once: true });
  };
  const sync = (next: typeof settings) => {
    settings = next;
    if (isContentSiteEnabled(next, location.hostname)) {
      activate(next);
      playTransformationAnimation(next.animation);
    } else {
      removeTheme();
      document.documentElement.dataset.retr0Excluded = 'true';
    }
  };
  if (isContentSiteEnabled(settings, location.hostname)) {
    document.documentElement.dataset.retr0Excluded = 'false';
    activate(settings);
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => playTransformationAnimation(settings.animation), { once: true });
    else playTransformationAnimation(settings.animation);
  } else {
    document.documentElement.dataset.retr0Excluded = 'true';
  }
  watchContentSettings(sync);
}

void boot().catch(() => {
  // A page should never lose functionality because the visual layer failed.
});
