import * as v from "valibot";

import rawLevelData from "../../../../public/data/level.json";
import { type ILevelData, LevelDataSchema } from "./data";

export const levelDataFixture: ILevelData = v.parse(LevelDataSchema, rawLevelData);
