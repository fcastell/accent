// Vendor
import {flags} from '@oclif/command';
import {existsSync} from 'fs';

// Command
import Command, {configFlag} from '../base';

// Formatters
import AddTranslationFormatter from '../services/formatters/project-add-translation';
import TranslationFormatter from '../services/formatters/project-translation';

// Services
import Document from '../services/document';
import CommitOperationFormatter from '../services/formatters/commit-operation';

export default class Translations extends Command {
  static description =
    'Add translation file in Accent';

  static examples = [
    `$ accent translations --file=fr.json --slug=fr --merge-type=smart --version=v0.23`
  ];

  static args = [];

  static flags = {
    add: flags.boolean({
      default: true,
      description:
        'Add a translation in Accent to help translators if you already have translated strings locally'
    }),
    slug: flags.string({
      description:
        'Add a translation to a specific slug'
    }),
    file: flags.string({
      description:
        'File to add'
    }),
    'document-path': flags.string({
      description: 'Document path'
    }),
    'dry-run': flags.boolean({
      default: false,
      description: 'Do not commit the changes in Accent'
    }),
    'merge-type': flags.string({
      default: 'passive',
      description:
        'Algorithm to use on existing strings when adding translation',
      options: ['smart', 'passive', 'force']
    }),
    'sync-type': flags.string({
      default: 'smart',
      description:
        'Algorithm to use on existing strings when syncing the main language',
      options: ['smart', 'passive']
    }),
    version: flags.string({
      default: '',
      description:
        'Sync a specific version, the tag needs to exists in Accent first'
    }),
    config: configFlag
  };

  async run() {
    const {flags} = this.parse(Translations);
    const t0 = process.hrtime.bigint();
    const documents = this.projectConfig.files();

    if (this.projectConfig.config.version?.tag && !flags.version) {
      flags.version = this.config.version;
    }

    // From all the documentConfigs, do the sync or peek operations and log the results.
    const translationFormatter = new TranslationFormatter();
    translationFormatter.log(flags);

    if (this.project!.revisions.length > 1 && flags['add'] && flags['slug']) {
      new AddTranslationFormatter().log(this.project!, flags['slug']);

      for (const document of documents) {
        await this.addTranslationDocumentConfig(document);
      }
    }

    if (flags['dry-run']) {
      const t1 = process.hrtime.bigint();
      translationFormatter.footerDryRun(t1 - t0);
      return;
    }

    const t2 = process.hrtime.bigint();
    translationFormatter.footer(t2 - t0);
  }

  private async addTranslationDocumentConfig(document: Document) {
    const {flags} = this.parse(Translations);
    const formatter = new CommitOperationFormatter();

    const file = flags['file']!;
    if (existsSync(file)) {
      const operation = await document.addTranslations(
        file,
        flags['slug']!,
        flags['document-path']!,
        flags
      );

      if (!operation.peek) {
        formatter.logAddTranslations(operation.file, operation.documentPath);
      }

      if (operation.peek) {
        formatter.logPeek(
          operation.file,
          operation.documentPath,
          operation.peek
        );
      }
    }
    else {
      console.error(`file ${file} doesn't exist`);
    }
  }
}
