import { Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import { Services } from '../../cortex/store/chrome.store';
import { useAppSelector, useAppService } from '../../cortex/utils/hooks';
import { PanelContent } from '../components/panel-content';
import { VerticalPanel } from '../components/vertical-panel';

export const ServicesPanel = () => {
  const services: Services = useAppSelector((state) => state.chrome.services);
  const servicesService = useAppService('services');

  return (
    <VerticalPanel>
      <PanelContent>
        <FormGroup>
          {Object.keys(services).map((serviceName) => {
            return (
              <FormControlLabel
                control={
                  <Checkbox
                    defaultChecked={services[serviceName].isVisible}
                    value={services[serviceName].isVisible}
                    onClick={() =>
                      servicesService.toggleServiceVisibility(serviceName)
                    }
                  />
                }
                label={serviceName}
              />
            );
          })}
        </FormGroup>
      </PanelContent>
    </VerticalPanel>
  );
};
