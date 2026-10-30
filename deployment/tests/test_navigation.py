import configparser
import importlib.util
from pathlib import Path
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[2]
spec = importlib.util.spec_from_file_location('navigation', ROOT / 'deployment/merge-navigation.py')
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


class Navigation(unittest.TestCase):
    def test_preserves_custom_and_disabled_bindings_and_is_idempotent(self):
        with tempfile.TemporaryDirectory() as directory:
            target = Path(directory) / 'wayfire.ini'
            original = '# custom\n[core]\nplugins = \\\n  oswitch \\\n  vswitch\n[oswitch]\nnext_output = none\n[vswitch]\nbinding_1 = <alt> KEY_1\n[unrelated]\nvalue = keep\n'
            target.write_text(original)
            module.merge(target, ROOT / 'config/wayfire.ini')
            result = target.read_text()
            module.merge(target, ROOT / 'config/wayfire.ini')
            self.assertEqual(result, target.read_text())
            self.assertTrue(result.startswith('# custom\n'))
            config = configparser.ConfigParser(interpolation=None)
            config.read_string(result)
            self.assertEqual(config['oswitch']['next_output'], 'none')
            self.assertEqual(config['vswitch']['binding_1'], '<alt> KEY_1')
            self.assertEqual(config['unrelated']['value'], 'keep')
            self.assertEqual(config['vswitch']['send_win_9'], '<super> <shift> KEY_9')

    def test_missing_sections(self):
        with tempfile.TemporaryDirectory() as directory:
            target = Path(directory) / 'wayfire.ini'
            target.write_text('[core]\nplugins = oswitch vswitch\n')
            module.merge(target, ROOT / 'config/wayfire.ini')
            config = configparser.ConfigParser(interpolation=None)
            config.read(target)
            self.assertIn('prev_output_with_win', config['oswitch'])
            self.assertIn('with_win_9', config['vswitch'])


if __name__ == '__main__':
    unittest.main()
