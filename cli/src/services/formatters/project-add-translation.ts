// Vendor
import * as chalk from 'chalk';

// Types
import {Project} from '../../types/project';

// Services
import {fetchFromRevision} from '../revision-slug-fetcher';

export default class ProjectAddTranslationFormatter {
  log(project: Project, slug: string) {
    const languages = project.revisions
      .filter(
        (revision) =>
          fetchFromRevision(revision) === slug
      )
      .map(fetchFromRevision)
      .join(', ');

    console.log(
      chalk.magenta('Updating translations paths'),
      '→',
      chalk.white(languages),
      chalk.green('✓')
    );

    console.log('');
  }
}
