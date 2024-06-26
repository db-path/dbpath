import { composeNameAndValidators, ErrorsAnd, flatMapErrors, hasErrors, mapErrors, NameAnd, NameAndValidator, parseFile, validateChild, validateChildDefined, validateNameAnd } from "@dbpath/utils";
import { CleanEnvironment, cleanEnvironment, dbPathDir, Environment, environmentValidator } from "@dbpath/environments";
import { cleanSummary, Summary, summaryValidator } from "@dbpath/config";
import { cleanNameAndScripts, cleanScript, CleanScript, Script, validateScript } from "@dbpath/scripts";
import { findFileInParentsOrError } from "@dbpath/files";
import Path from "path";

export interface Config {
  environments: NameAnd<Environment>,
  summary: Summary,
  scripts?: NameAnd<Script>
}
export interface CleanConfig {
  environments: NameAnd<CleanEnvironment>,
  summary: Summary,
  scripts: NameAnd<CleanScript>

}


export const cleanConfig = ( envVars: NameAnd<string> ) => ( config: Config ): CleanConfig => {
  const scripts = cleanNameAndScripts ( 'config', config.scripts )
  if ( hasErrors ( scripts ) ) throw Error ( `Errors in scripts. This should have been caught sooner: ${JSON.stringify ( scripts )}` )
  let result = {
    environments: cleanEnvironment ( envVars, config.environments ),
    summary: cleanSummary ( config.summary ),
    scripts
  };
  return result;
};

export const envValidator: NameAndValidator<Config> = composeNameAndValidators (
  validateChildDefined ( 'environments' ),
  validateChild ( 'environments', validateNameAnd ( environmentValidator ) ),
  validateChildDefined ( 'summary' ),
  validateChild ( 'summary', summaryValidator ),
  validateChild ( "scripts", validateNameAnd ( validateScript ), true ),
)

export function makeConfig ( cwd: string, configFileName: string, envVars: NameAnd<string> ): ErrorsAnd<CleanConfig> {
  return flatMapErrors ( findFileInParentsOrError ( cwd, dbPathDir ), dir =>
    flatMapErrors ( parseFile ( Path.join ( dir, configFileName ) ), config =>
      mapErrors ( config, cleanConfig ( envVars ) ) ) )
}