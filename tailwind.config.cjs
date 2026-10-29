module.exports = {
  "darkMode": "class",
  "theme": {
    "extend": {
      "fontFamily": {
        "sans": [
          "\"Plus Jakarta Sans\"",
          "-apple-system",
          "BlinkMacSystemFont",
          "\"Segoe UI\"",
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif"
        ],
        "mono": [
          "\"JetBrains Mono\"",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "monospace"
        ],
        "heading": [
          "\"Plus Jakarta Sans\"",
          "-apple-system",
          "BlinkMacSystemFont",
          "\"Segoe UI\"",
          "sans-serif"
        ]
      },
      "colors": {
        "background": "var(--background)",
        "foreground": "var(--foreground)",
        "card": {
          "DEFAULT": "var(--card)",
          "foreground": "var(--card-foreground)"
        },
        "popover": {
          "DEFAULT": "var(--popover)",
          "foreground": "var(--popover-foreground)"
        },
        "primary": {
          "DEFAULT": "var(--primary)",
          "foreground": "var(--primary-foreground)"
        },
        "secondary": {
          "DEFAULT": "var(--secondary)",
          "foreground": "var(--secondary-foreground)"
        },
        "muted": {
          "DEFAULT": "var(--muted)",
          "foreground": "var(--muted-foreground)"
        },
        "accent": {
          "DEFAULT": "var(--accent)",
          "foreground": "var(--accent-foreground)"
        },
        "destructive": {
          "DEFAULT": "var(--destructive)"
        },
        "border": "var(--border)",
        "input": "var(--input)",
        "ring": "var(--ring)",
        "sidebar": {
          "DEFAULT": "var(--sidebar)",
          "foreground": "var(--sidebar-foreground)",
          "primary": "var(--sidebar-primary)",
          "primary-foreground": "var(--sidebar-primary-foreground)",
          "accent": "var(--sidebar-accent)",
          "accent-foreground": "var(--sidebar-accent-foreground)",
          "border": "var(--sidebar-border)",
          "ring": "var(--sidebar-ring)"
        }
      },
      "borderRadius": {
        "sm": "calc(var(--radius) * 0.6)",
        "md": "calc(var(--radius) * 0.8)",
        "lg": "var(--radius)",
        "xl": "calc(var(--radius) * 1.4)",
        "2xl": "calc(var(--radius) * 1.8)"
      }
    }
  },
  "content": [
    "./*.html",
    "./portal-admin.js",
    "./portal-security.js",
    "./app.js"
  ]
};
