#!/usr/bin/env python3
"""Add missing navigation defaults without replacing user shortcuts or comments."""
import configparser
from pathlib import Path
import re
import sys


def merge(target, defaults):
    text = target.read_text()
    current = configparser.ConfigParser(interpolation=None, strict=True)
    current.read_string(text)
    shipped = configparser.ConfigParser(interpolation=None)
    shipped.read(defaults)
    for section in ('oswitch', 'vswitch'):
        missing = [(key, value) for key, value in shipped[section].items()
                   if not current.has_option(section, key)]
        if not missing:
            continue
        additions = ''.join(f'{key} = {value}\n' for key, value in missing)
        header = re.search(r'^\[' + section + r'\]\s*$', text, re.M)
        if header:
            end = re.search(r'^\[', text[header.end():], re.M)
            pos = header.end() + end.start() if end else len(text)
            text = text[:pos].rstrip('\n') + '\n' + additions + '\n' + text[pos:]
        else:
            text = text.rstrip('\n') + f'\n\n[{section}]\n' + additions
    # Do not silently enable plugins the user deliberately disabled.
    plugins = current.get('core', 'plugins', fallback='').replace('\\', '').split()
    for plugin in ('oswitch', 'vswitch'):
        if plugin not in plugins:
            print(f'Navigation requires core.plugins to include {plugin}.', file=sys.stderr)
    if text != target.read_text():
        target.write_text(text)


if __name__ == '__main__':
    merge(Path(sys.argv[1]), Path(sys.argv[2]))
