import React from 'react';
import Svg, { Path, G } from 'react-native-svg';
import { Colors } from '../theme';

export const KtmLogo = ({ size = 100, color = Colors.primary }) => (
  <Svg width={size} height={size * 0.4} viewBox="0 0 300 120">
    <G fill={color}>
      {/* Simplified KTM Logo Shape */}
      <Path d="M10,20 L50,20 L70,60 L90,20 L130,20 L100,80 L80,80 L60,40 L40,80 L10,80 Z" />
      <Path d="M140,20 L240,20 L240,40 L190,40 L190,80 L170,80 L170,40 L140,40 Z" />
      <Path d="M250,20 L270,20 L290,60 L290,20 L310,20 L310,80 L290,80 L270,40 L270,80 L250,80 Z" />
    </G>
  </Svg>
);
