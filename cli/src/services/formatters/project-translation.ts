// Vendor
import * as chalk from 'chalk';

// Types
// import {Project} from '../../types/project';

// Services
import Base from './base';

export default class ProjectTranslationFormatter extends Base {
  log(flags: any) {
    const logFlags = [];
    if (flags.version) logFlags.push(chalk.gray(`${flags.version}`));

    console.log(
      chalk.magenta('Manage translation '),
      '→',
      chalk.white(
        flags.slug,
        logFlags.join('') || null
      ),
      chalk.green('✓')
    );
    console.log('');
  }

  footerDryRun(time: bigint) {
    console.log('');
    console.log(
      chalk.gray.dim(
        'For more informations on operations: https://www.accent.reviews/guides/glossary.html#sync'
      )
    );
    console.log(
      chalk.gray.dim(this.formatSyncingTime(time)),
      'remove --dry-run to commit your changes to the server'
    );
    console.log('');
  }

  footer(time: bigint) {
    console.log('');
    console.log(
      chalk.gray.dim(
        'For more informations on operations: https://www.accent.reviews/guides/glossary.html#sync'
      )
    );
    console.log(
      chalk.gray.dim(this.formatSyncingTime(time)),
      'completed without issues'
    );
    console.log('');
  }

  formatSyncingTime(time: bigint) {
    return this.formatTiming(
      time,
      (count) => `Syncing took ${count} milliseconds,`
    );
  }
}
