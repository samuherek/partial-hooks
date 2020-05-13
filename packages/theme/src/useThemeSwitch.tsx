import React from 'react';

interface ThemeContext {
  themes: string[];
  setTheme: (nextTheme: string) => void;
}

type ThemeSwitchProviderProps = {
  value: ThemeContext;
  children: React.ReactNode;
};

const THEME_KEY = '__PARTIAL_THEME_KEY__';

const Context = React.createContext<ThemeContext | undefined>(undefined);

function ThemeSwitchProvider(props: ThemeSwitchProviderProps) {
  const { value, ...rest } = props;
  return <Context.Provider value={value} {...rest} />;
}

function useConfigThemeSwitch({
  init = 'light',
  themes = ['light', 'dark'],
  persist = true,
}) {
  const [themeValue, setThemeValue] = React.useState(init || themes[0]);

  React.useLayoutEffect(() => {
    const localVal = window.localStorage.getItem(THEME_KEY);
    const localExists =
      typeof localVal === 'string' && themes.some((t) => t === localVal);

    if (persist && localVal && localExists && localVal !== themeValue) {
      setThemeValue(localVal);
    }
  }, []);

  const setTheme = React.useCallback(
    (nextTheme) => {
      if (!themes.some((c) => c === nextTheme)) {
        console.warn(
          `useThemeSwitch: ${nextTheme} was not provided as an option`
        );
        return;
      }
      setThemeValue(nextTheme);
      if (persist) {
        window.localStorage.setItem(THEME_KEY, nextTheme);
      }
    },
    [setThemeValue, persist]
  );

  return {
    currTheme: themeValue,
    themes,
    setTheme,
  };
}

function useThemeSwitch() {
  const context = React.useContext(Context);
  if (context === undefined) {
    throw new Error(
      'useThemeSwitch needs to be wrapped in a ThemeSwitchProvide'
    );
  }

  return context;
}

export { useConfigThemeSwitch, ThemeSwitchProvider, useThemeSwitch };
