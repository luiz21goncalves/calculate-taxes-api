import fs from 'node:fs/promises'

import { CronJob } from 'cron'

import { CONFIG } from '@/config'
import { logger } from '@/logger'

const EVERY_DAY_AT_MIDNIGHT = '0 0 0 * * *'

export const deleteXmlFilesJob = new CronJob(
  EVERY_DAY_AT_MIDNIGHT,
  async () => {
    logger.info('running delete xml files')
    const files = await fs.readdir(CONFIG.DIR.XML)

    const promises = files.map((file) => fs.unlink(`${CONFIG.DIR.XML}/${file}`))
    await Promise.all(promises)

    await fs.writeFile(`${CONFIG.DIR.XML}/.gitkeep`, '')
    logger.info('finished delete xml files')
  },
)

export const deleteJsonFilesJob = new CronJob(
  EVERY_DAY_AT_MIDNIGHT,
  async () => {
    logger.info('running delete json files')
    const files = await fs.readdir(CONFIG.DIR.JSON)

    const promises = files.map((file) =>
      fs.unlink(`${CONFIG.DIR.JSON}/${file}`),
    )
    await Promise.all(promises)

    await fs.writeFile(`${CONFIG.DIR.JSON}/.gitkeep`, '')
    logger.info('finished delete json files')
  },
)
