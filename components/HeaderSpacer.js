// components/HeaderSpacer.js
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { Platform, StatusBar, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * HeaderSpacer
 * Ajoute un espace en haut de l'écran pour éviter que le contenu passe sous une TopNavbar fixe.
 *
 * Props:
 * - height (number): hauteur de ta TopNavbar (ex: 56, 60, 64). Par défaut: 56.
 * - extra (number): marge supplémentaire sous la navbar. Par défaut: 8.
 * - includeStatus ('auto' | true | false):
 *     - 'auto' (défaut): iOS -> insets.top, Android -> StatusBar.currentHeight
 *     - true : force l’ajout du padding status bar (iOS = notch, Android = StatusBar)
 *     - false: n’ajoute pas de padding de status bar
 *
 * Exemple:
 *   <HeaderSpacer height={60} />
 */
export default function HeaderSpacer({ height = 56, extra = 8, includeStatus = 'auto' }) {
  const insets = useSafeAreaInsets();

  const statusPad = useMemo(() => {
    if (includeStatus === false) return 0;

    const iosPad = insets.top;
    const androidPad = StatusBar.currentHeight ?? 0;

    if (includeStatus === true) {
      return Platform.OS === 'ios' ? iosPad : androidPad;
    }

    // 'auto'
    return Platform.OS === 'ios' ? iosPad : androidPad;
  }, [includeStatus, insets.top]);

  const spacerHeight = useMemo(
    () => Math.max(0, Math.round(statusPad + height + extra)),
    [statusPad, height, extra]
  );

  return <View style={{ height: spacerHeight }} />;
}

HeaderSpacer.propTypes = {
  height: PropTypes.number,
  extra: PropTypes.number,
  includeStatus: PropTypes.oneOf(['auto', true, false]),
};
