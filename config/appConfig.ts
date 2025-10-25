import { ProjectConfig } from '../types';

export const PARTNERS_DATA_URL = "https://script.google.com/macros/s/AKfycbwJDAo__-e6gGzzkOLK3CZJnxoertGEXyJ08hoEFHLsvvBglXFgQ1JE6X2B-NYjBPjnPA/exec";

export const PROJECTS_CONFIG: ProjectConfig[] = [
    {
        name: 'مشروع وفود الحرم',
        type: 'wofood',
        dataSourceUrl: 'https://script.google.com/macros/s/AKfycbwbbrvaMzSgMDE7Mqnm4pTn-CYmmjnuZu3mkB4yXThVf4klxRFl3skEUu-zEgRuJjrJ/exec',
    },
    {
        name: 'مشروع ولك الأجر',
        type: 'walak-al-ajer',
        dataSourceUrl: 'https://script.google.com/macros/s/AKfycbzO3WDosDGPYyArS7YbI3WleQABHKaUV0q0A1CZX3YDIE0t2Ixe_l6ArY8FoVvbWv_K/exec',
    },
    {
        name: 'مشروع تفطير الصائمين',
        type: 'iftar',
        dataSourceUrl: 'https://script.google.com/macros/s/AKfycbyMIM-xO06H5cobovsyvu7jtUw_tYuJWjzdpxSqUINiUYKfX_dLzavI3AVi604obFmEBQ/exec',
        satisfactionDataSourceUrl: 'https://script.google.com/macros/s/AKfycby0wkdxwenqSatQLZL4XWTK95nBjE8KJUvxEyGiwFSVWyf16wmx3vTKhfyW2Kb5OCdj6A/exec',
    },
    {
        name: 'مشروع السقيا',
        type: 'suqia',
        dataSourceUrl: 'https://script.google.com/macros/s/AKfycbzh02AHXChpo-9tPGxs1OXO5WGZpP8b-9wMrDzBY-FPd1LqaikpBD92Hg3viuOB1J07/exec',
        satisfactionDataSourceUrl: 'https://script.google.com/macros/s/AKfycbzFI2uthgIPXc1pJ1wV6yHOSpJ-RDoR7bJWKdNnVQZ5a1z7YH4fFpT3RfI_yE8ClJkZ4Q/exec',
    },
    {
        name: 'مشروع الترجمة والإرشاد',
        type: 'translation',
        dataSourceUrl: 'https://script.google.com/macros/s/AKfycbxn7_pbmGBEh8PhK88wCU7-8vNmufBeMNsIESNgcI4_rAhbUb26LvdcyKPGj0HU0B5vYw/exec',
    },
];
